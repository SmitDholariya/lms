const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb Connected");
  } catch (error) {
    console.log("Error Connecting");
  }
};

module.exports = connectDb;
