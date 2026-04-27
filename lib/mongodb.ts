import mongoose from "mongoose";

function normalizeMongoUri(raw?: string) {
  if (!raw) return undefined;

  let value = raw.trim();
  value = value.replace(/^MONGODB_(?:URI|URL)\s*=\s*/i, "");

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return value;
}

const MONGODB_URI = normalizeMongoUri(process.env.MONGODB_URI) ?? normalizeMongoUri(process.env.MONGODB_URL);

function isUsableMongoUri(uri?: string) {
  if (!uri) return false;

  const lowered = uri.toLowerCase();
  if (lowered.includes("username:password")) return false;
  if (lowered.includes("your_mongodb")) return false;
  return true;
}

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
};

const globalMongoose = globalThis as typeof globalThis & { mongoose?: CachedMongoose };

const cached =
  globalMongoose.mongoose ??
  (globalMongoose.mongoose = {
    conn: null,
    promise: null,
  });

export async function connectToDB() {
  if (process.env.SKIP_MONGODB === "true") {
    return null;
  }

  if (!isUsableMongoUri(MONGODB_URI)) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false }).then((connection) => connection).catch(() => null);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}