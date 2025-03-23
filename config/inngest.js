import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

/* ================== SYNC USER CREATION ================== */
// export const syncUserCreation = inngest.createFunction(
//   { id: 'sync-user-from-clerk' },
//   { event: 'clerk/user.created' },
//   async ({ event }) => {
//     console.log("Received clerk/user.created event:", event.data);

//     const { id, first_name, last_name, email_addresses, image_url } = event.data;
//     const userData = {
//       _id: id,
//       email: email_addresses[0].email_address,
//       name: first_name + ' ' + last_name,
//       imageUrl: image_url
//     };

//     try {
//       console.log("Connecting to DB for user creation...");
//       await connectDB();
//       console.log("Connected to DB. Creating user:", userData);
//       await User.create(userData);
//       console.log("User created successfully:", id);
//     } catch (err) {
//       console.error("Error in syncUserCreation:", err);
//       throw err;
//     }
//   }
// );


export const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
      console.log("Received clerk/user.created event:", event.data);
  
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
  
      const fullName = `${first_name || ''} ${last_name || ''}`.trim() || "Unnamed User";
  
      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: fullName,
        imageUrl: image_url || "https://placehold.co/100x100?text=No+Image"
      };
  
      try {
        console.log("Pre-creation validation data:", userData);
        console.log("Connecting to DB for user creation...");
        await connectDB();
        console.log("Connected to DB. Creating user:", userData);
        await User.create(userData);
        console.log("✅ User created successfully:", id);
      } catch (err) {
        console.error("❌ Error in syncUserCreation:", err);
        throw err;
      }
    }
  );
  

/* ================== SYNC USER UPDATE ================== */
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    console.log("Received clerk/user.updated event:", event.data);

    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + ' ' + last_name,
      imageUrl: image_url
    };

    try {
      console.log("Connecting to DB for user update...");
      await connectDB();
      console.log("Connected to DB. Updating user:", id);
      await User.findByIdAndUpdate(id, userData);
      console.log("User updated successfully:", id);
    } catch (err) {
      console.error("Error in syncUserUpdation:", err);
      throw err;
    }
  }
);

/* ================== SYNC USER DELETION ================== */
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-with-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    console.log("Received clerk/user.deleted event:", event.data);

    const { id } = event.data;

    try {
      console.log("Connecting to DB for user deletion...");
      await connectDB();
      console.log("Connected to DB. Deleting user:", id);
      await User.findByIdAndDelete(id);
      console.log("User deleted successfully:", id);
    } catch (err) {
      console.error("Error in syncUserDeletion:", err);
      throw err;
    }
  }
);

// inngest function to create user's order in database

export const createUserOrder = inngest.createFunction(
  {
    id:'create-user-order',
    batchEvents:{
      maxSize:25,
      timeout:'5s'
    }
  },
  {  event:'order/created'
  },
  async ({events}) =>{
    const orders = events.map((event )=>{
      return {
        userId:event.data.userId,
        items:event.data.items,
        amount:event.data.amount,
        address:event.data.address,
        date:event.date
      }
    })

    await connectDB();
    await Order.insertMany(orders)

    return {success:true , processed:orders.length};
  })

