import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(request){
    try {
        const {userId} = getAuth();
        const {address , items}  = await request.json();
        if(!address || items.length ===0){
            return NextResponse.json({success:true, message:'Invalid data'})
        }

        // calculate amount using items
        const amount = await items.reduce(async(acc,item)=>{
            const product = await Product.findById(item.product);
            return acc +product.offerPrice *item.quantity;
        },0)

        await inngest.send({
            name:'order/created',
            data:{
                userId,
                address,
                items,
                amount:amount + Math.floor(amount*0.02),
                date:Date.now()
            }
        })

        //clear user cart
        const user = await User.findById(userId)
        user.cartItems ={}
        await user.save()

        return NextResponse.json({success:true  , message: 'Order Placed'})

    } catch (error) {

        console.log(error)
        return NextResponse.json({success:false , message:"Order not placed"})
        
    }
}