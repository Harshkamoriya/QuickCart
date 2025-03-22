import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/config/db";

export async function GET(request) {
    console.log("API HIT: GET /api/user/data");

    try {
        const { userId } = getAuth(request);
        console.log("Extracted Clerk userId:", userId);

        if (!userId) {
            console.warn("No userId found from Clerk.");
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        console.log("Connecting to MongoDB...");
        await connectDB();
        console.log("MongoDB connected!");

        console.log("Finding user with ID:", userId);
        const user = await User.findOne({ _id: userId });
        console.log("User query result:", user);

        if (!user) {
            console.warn("User not found in database for ID:", userId);
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        console.log("User found, returning response...");
        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error("API ERROR:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
