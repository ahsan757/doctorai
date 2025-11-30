import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI in your .env");
}

const cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
    console.log("Connected")
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
    return cached.conn;
}
