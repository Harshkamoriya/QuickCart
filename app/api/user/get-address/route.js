import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";



export async function GET(request){

    try {
        const {userId} = getAuth(request)

        await connectDB()
        const addresses = await Address.find({userId})
        return NextResponse.json({success:true , addresses});

    } catch (error) {
        return Nextresponse.json({success:false ,message : error.message})
    }
}