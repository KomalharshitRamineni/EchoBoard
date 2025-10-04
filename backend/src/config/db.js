import mongoose from "mongoose"

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB CONNECTED SUCCESSFULLY!");
    } catch (error) {
        console.error("Error connection to MONGOB", error);
        process.exit(1) // status code 1 means exit sith failure, 0 means success
    }
}