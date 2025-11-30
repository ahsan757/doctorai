import { connectDB } from "@/lib/db";
import Chat from "@/models/chat.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const sessions = await Chat.find({}, { sessionId: 1, _id: 0, createdAt: 1 }).sort({ createdAt: -1 });

    return NextResponse.json({ sessions });
  } catch (error) {
    return NextResponse.json({ error: error || "Server error" }, { status: 500 });
  }
}