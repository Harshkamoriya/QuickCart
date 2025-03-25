import User from "@/models/User";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request){
    try {
        const {userId} = getAuth(request)

        console.log("userId", userId);

        await connectDB();
        const user = await User.findById(userId)
        const {cartItems} = user
        return NextResponse.json({success:true , cartItems})
    } catch (error) {
        console.log("we are getting error in thr api/cart/get")
        return NextResponse.json({success:false  , message : error.message})
    }
}