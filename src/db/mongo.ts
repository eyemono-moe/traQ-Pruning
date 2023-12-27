import * as mongoose from "mongoose";
import env from "~/lib/env";
import { SessionDB, UserSession } from ".";

const sessionSchema = new mongoose.Schema<UserSession>({
  userId: { type: String, required: true },
  token: { type: String, required: true },
});

const Session =
  mongoose.models.session || mongoose.model("session", sessionSchema);

if (env("NODE_ENV") === "production") {
  const MONGODB_DATABASE = env("NS_MONGODB_DATABASE");
  const MONGODB_USERNAME = env("NS_MONGODB_USER");
  const MONGODB_PASSWORD = env("NS_MONGODB_PASSWORD");
  const MONGODB_HOSTNAME = env("NS_MONGODB_HOSTNAME");
  const MONGODB_PORT = env("NS_MONGODB_PORT");

  const MONGO_URI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
  console.log("Connecting to MongoDB:", MONGO_URI);

  mongoose.connect(MONGO_URI);
}

export const mongoSessionDb: SessionDB = {
  async get(userId) {
    const session = await Session.findOne({ userId });
    if (!session) return null;
    return session;
  },
  async delete(userId) {
    await Session.deleteMany({ userId });
  },
  async set(userId, token) {
    await Session.updateOne({ userId }, { userId, token }, { upsert: true });
  },
};
