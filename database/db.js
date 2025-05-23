const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoDB connected successfully");
  } catch (e) {
    console.error("MongoDB connection failed");
    process.exit(1);
  }
};

module.exports = connectToDB;
