import mongoose from 'mongoose';

// const uri: string = "mongodb+srv://tmp_user:<cs590>@cs590.lb5ykha.mongodb.net/?retryWrites=true&w=majority&appName=CS590";
const uri:string = "mongodb+srv://tmp_user:cs590@cs590.lb5ykha.mongodb.net/shopping?retryWrites=true&w=majority&appName=CS590";

const clientOptions: mongoose.ConnectOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

async function run(): Promise<void> {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error; // Re-throw the error to handle it outside or to crash the application.
  }
  
  // finally {
  //   // Ensures that the client will close when you finish/error
  //   // await mongoose.disconnect();
  //   // console.log("Closed the connection!");
  //   console.log("Keep the connection open!")
  // }
}

run().catch(console.dir);

// insert a new order into the database
// const order = new Order({
//   buyer_id: '5537',
//   seller_id: '4564',
//   product_id: new mongoose.Types.ObjectId('6613177b152a1d51fbf2f1c4'),
//   modified_at: new Date(),
//   created_at: new Date(),
//   is_deleted: false,
//   order_status: 'finished'
// });

// order.save({})
//   .then(() => {
//     console.log('Order saved');
//   })
//   .catch((err: any) => {
//     console.error(err);
//   });
