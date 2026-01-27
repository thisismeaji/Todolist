import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment")
}

let client: MongoClient
let clientPromise: Promise<MongoClient>
let dbPromise: Promise<Db> | null = null

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDb() {
  if (!dbPromise) {
    const client = await clientPromise
    const dbName = process.env.MONGODB_DB || "test"
    dbPromise = Promise.resolve(client.db(dbName))
  }
  return dbPromise
}

let indexesReady: Promise<void> | null = null

export async function ensureUserIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb()
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
      await db
        .collection("tasks")
        .createIndex({ userId: 1, createdAt: -1 })
    })()
  }
  return indexesReady
}
