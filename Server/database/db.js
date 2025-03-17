const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongodb Connected");
  } catch (error) {
    console.log("Error Connecting");
  }
};

module.exports = connectDb;
