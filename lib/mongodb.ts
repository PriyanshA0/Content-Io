import mongoose from "mongoose";

const TARGET_DB_NAME = "ContentIo";

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

function ensureDatabaseName(uri: string, dbName: string) {
  try {
    const parsed = new URL(uri);
    parsed.pathname = `/${dbName}`;
    return parsed.toString();
  } catch {
    return uri.replace(/\/[^/?]*(\?.*)?$/, `/${dbName}$1`);
  }
}

const normalizedMongoUri = normalizeMongoUri(process.env.MONGODB_URI) ?? normalizeMongoUri(process.env.MONGODB_URL);
const MONGODB_URI = normalizedMongoUri ? ensureDatabaseName(normalizedMongoUri, TARGET_DB_NAME) : undefined;

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