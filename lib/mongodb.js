import { MongoClient } from "mongodb";

/**
 * MongoDB Atlas Managed Connection Provider
 * Supports Atlas (mongodb+srv://) and local instances with connection pooling.
 * Falls back gracefully to in-memory mode when unconfigured.
 */
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cardwise";
const options = {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.warn("MongoDB development connection warning (falling back gracefully):", err.message);
      return null;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.warn("MongoDB production connection warning (falling back gracefully):", err.message);
    return null;
  });
}

/**
 * Returns database instance or null if unavailable
 */
export async function getDatabase() {
  try {
    const connectedClient = await clientPromise;
    if (!connectedClient) return null;
    // Use database specified in URI or default to "cardwise"
    return connectedClient.db();
  } catch (err) {
    console.warn("Could not retrieve MongoDB database:", err.message);
    return null;
  }
}

export default clientPromise;

