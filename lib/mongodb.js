import { MongoClient } from "mongodb";

/**
 * MongoDB Connection Provider
 * Supports Atlas (mongodb+srv://) and local instances with connection pooling.
 * Falls back gracefully when unconfigured or unreachable.
 */
const uri = process.env.MONGODB_URI || "";
const options = {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
};

let client;
let clientPromise;

if (!uri && process.env.NODE_ENV === "production") {
  // If no URI is provided in production, avoid blocking cold starts with connection timeouts
  clientPromise = Promise.resolve(null);
} else {
  const targetUri = uri || "mongodb://127.0.0.1:27017/cardwise";

  // In development and serverless, reuse clientPromise across hot-reloads and invocations
  if (!global._mongoClientPromise) {
    try {
      client = new MongoClient(targetUri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.warn("MongoDB connection warning (falling back gracefully):", err.message);
        return null;
      });
    } catch (err) {
      console.warn("MongoDB initialization warning:", err.message);
      global._mongoClientPromise = Promise.resolve(null);
    }
  }
  clientPromise = global._mongoClientPromise;
}

/**
 * Returns database instance or null if unavailable
 */
export async function getDatabase() {
  try {
    const connectedClient = await clientPromise;
    if (!connectedClient) return null;
    return connectedClient.db();
  } catch (err) {
    console.warn("Could not retrieve MongoDB database:", err.message);
    return null;
  }
}

export default clientPromise;
