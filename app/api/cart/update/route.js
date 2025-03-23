import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth, User } from "@clerk/nextjs/server";
export async function POST(request) {

try {
    const {userId} = getAuth()

const {cartData}= await request.json()
await connectDB()
const user = await User.findById(user.id)

user.cartItems = cartData;
   await user.save();
return NextResponse.json({success:true , message : "cart items posted successfully"})


} catch (error) {
    return NextResponse.json({success:false, message: error.message})
    
}

}