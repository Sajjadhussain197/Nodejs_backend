import mongoose from "mongoose";

 const connectDB =async ()=>{
    try {
        const connectionInstance = await mongoose.connect('mongodb+srv://admin:Sajjad%409582@cluster0.cuy54vx.mongodb.net/videoTube?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log(`\n Mongo Db is connected Successfull !! DB Host: ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MongoDb connection Error",error)
        process.exit(1)
        
    }

}

export default connectDB;
