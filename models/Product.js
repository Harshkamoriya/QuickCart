import mongoose from "mongoose";

const productSchema  = new mongoose.Schema({
    userId:{type:string , required:true , ref:"user"},
    name:{type:string , required:true},
    description:{type:string , required:true},
    price:{type:number , required:true},
    offerPrice:{type:number , required:true},
    image:{type:array , required:true},
    category:{type:string , required:true},
    date:{type:number , required:true},

})

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product