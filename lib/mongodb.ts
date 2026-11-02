import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

// Stored on globalThis so the cache survives hot reloads in development,
// which re-evaluate this module and would otherwise open a new connection each time.
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = (globalThis.mongooseCache ??= {
  conn: null,
  promise: null,
});

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment");
  }

  // Reuse the in-flight promise so concurrent callers share one connection attempt.
  cached.promise ??= mongoose.connect(uri, { bufferCommands: false });

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear the failed promise so the next call can retry instead of rethrowing forever.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
