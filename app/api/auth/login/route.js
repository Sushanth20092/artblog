import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import { signToken, serializeTokenCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create JWT token
    const token = signToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    // Create cookie
    const cookie = serializeTokenCookie(token);

    return NextResponse.json(
      { message: "Login successful" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
