const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error(
      "MONGO_URI is not set in Backend/.env — the server will keep running, " +
        "but every database request will fail until you set it."
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected:", uri);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error(
      "The server is still running, but database requests will fail until " +
        "MongoDB is reachable. Check that mongod is running (local) or that " +
        "your Atlas connection string, username/password, and IP allowlist are correct."
    );
  }
}

module.exports = connectDB;
