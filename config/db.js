const config = require("config");
const mongoose = require("mongoose");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    // By default is set to 'false' but we need 'true'
    mongoose.set("strictQuery", true);
    await mongoose.connect(db);
    console.log("DB connected...");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
