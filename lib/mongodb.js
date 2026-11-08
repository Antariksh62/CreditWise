import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cardwise";
const options = {
  connectTimeoutMS: 3000,
  serverSelectionTimeoutMS: 3000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn("MongoDB connection warning (falling back gracefully):", err.message);
      return null;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.warn("MongoDB production connection warning:", err.message);
    return null;
  });
}

/**
 * Returns database instance or null if unavailable
 */
export async function getDatabase() {
  try {
    const client = await clientPromise;
    if (!client) return null;
    return client.db("cardwise");
  } catch (err) {
    console.warn("Could not retrieve MongoDB database:", err.message);
    return null;
  }
}

export default clientPromise;

