import mongoose from "mongoose";

export const dbConfig = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "MongoDB connected successfully , ",
      connection.connection.host
    );
  } catch (error) {
    console.error("MongoDB connection error: ", error.message);
    process.exit(1);
  }
};
