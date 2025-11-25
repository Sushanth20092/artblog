import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "MongoDB connected successfully!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Connection failed", error: error.message },
      { status: 500 }
    );
  }
}
