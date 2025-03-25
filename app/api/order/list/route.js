import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const { userId } = getAuth(request); // ✅ Fix: Pass `request`

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }

        await connectDB();

        const orders = await Order.find({ userId }).populate("address items.product");

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        console.error(" error running the code" , error.message)
        return NextResponse.json({ success: false, message: error.message });
    }
}
