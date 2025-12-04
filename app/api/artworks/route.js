// /app/api/artworks/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import { getCookieName, verifyToken } from "@/lib/auth";

/**
 * GET  /api/artworks   -> public: returns list of artworks (optionally filtered)
 * POST /api/artworks   -> protected: create new artwork (admin only)
 */

export async function GET(req) {
  try {
    await connectDB();
    // optional query params: ?limit=8&featured=true
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "0", 10);
    const featured = url.searchParams.get("featured");

    const q = featured === "true" ? { featured: true } : {};
    let find = Artwork.find(q).sort({ createdAt: -1 });
    if (limit > 0) find = find.limit(limit);

    const artworks = await find.exec();
    return NextResponse.json({ ok: true, artworks });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // verify admin token from cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const cookieName = getCookieName();
    const cookiePair = cookieHeader.split("; ").find((c) => c.startsWith(`${cookieName}=`));
    const token = cookiePair ? cookiePair.split("=").slice(1).join("=") : null;

    if (!token) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
      verifyToken(token);
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
    }

    const { title, description, images, status = "for-sale", slug, featured = false } = await req.json();

    if (!title || !description || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ ok: false, error: "title, description and images[] are required" }, { status: 400 });
    }

    await connectDB();

    // generate slug if not provided
    const baseSlug = slug?.trim() || title.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
    let uniqueSlug = baseSlug;
    let count = 0;
    while (await Artwork.findOne({ slug: uniqueSlug })) {
      count += 1;
      uniqueSlug = `${baseSlug}-${count}`;
    }

    const artwork = await Artwork.create({
      title,
      description,
      images,
      status,
      slug: uniqueSlug,
      featured: !!featured,
    });

    return NextResponse.json({ ok: true, artwork }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
