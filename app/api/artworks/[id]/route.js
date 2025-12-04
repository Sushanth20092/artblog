// /app/api/artworks/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Artwork from "@/models/Artwork";
import { getCookieName, verifyToken } from "@/lib/auth";

async function requireAdmin(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieName = getCookieName();
  const cookiePair = cookieHeader.split("; ").find((c) => c.startsWith(`${cookieName}=`));
  const token = cookiePair ? cookiePair.split("=").slice(1).join("=") : null;
  if (!token) throw new Error("unauthorized");
  try {
    verifyToken(token);
  } catch (err) {
    throw new Error("unauthorized");
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const art = await Artwork.findById(id);
    if (!art) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, artwork: art });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    await requireAdmin(req);

    const { id } = params;
    const body = await req.json();
    // allow updates to title, description, images, status, featured, slug
    const allowed = ["title", "description", "images", "status", "featured", "slug"];
    const update = {};
    for (const k of allowed) if (k in body) update[k] = body[k];

    const art = await Artwork.findByIdAndUpdate(id, update, { new: true });
    if (!art) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, artwork: art });
  } catch (err) {
    if (err.message === "unauthorized") return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    await requireAdmin(req);

    const { id } = params;
    const art = await Artwork.findByIdAndDelete(id);
    if (!art) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, message: "Deleted" });
  } catch (err) {
    if (err.message === "unauthorized") return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
