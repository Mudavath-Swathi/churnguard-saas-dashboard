import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", ()=>{console.log("Database connected successfully")});

    let mongodbURI = process.env.MONGODB_URI;
    const projectName = 'ChurnGuard';

    if(!mongodbURI){
        throw new Error("MongoDB_URI environment variables not set");
    }

    if(mongodbURI.endsWith('/')){
        mongodbURI = mongodbURI.slice(0, -1);
    }

    await mongoose.connect(`${mongodbURI}/${projectName}`, {
    autoIndex: true,});
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
}  

}

export default connectDB;
