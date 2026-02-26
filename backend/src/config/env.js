const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongodbUri:
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/internshala_assignment",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-this",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  adminInviteToken: process.env.ADMIN_INVITE_TOKEN || "",
};
