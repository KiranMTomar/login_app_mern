import mongoose from "mongoose";
import ENV from "../config.js";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  mongoose.set("strictQuery", true);
  // const db = await mongoose.connect(uri);
  const db = await mongoose.connect(ENV.MONGO_URI);
  console.log("Database connected");
  return db;
}

export default connect;
