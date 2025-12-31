const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI || "mongodb://localhost:27017/devMeet";

  console.log("Connecting to MongoDB:", uri); // 👈 ADD THIS

  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
