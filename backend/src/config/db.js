const mongoose = require("mongoose");
const env = require("./env");

const connectDatabase = async () => {
  await mongoose.connect(env.mongodbUri);
  return mongoose.connection;
};

module.exports = connectDatabase;

