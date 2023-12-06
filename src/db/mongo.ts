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
	const MONGODB_DATABASE = env("MONGODB_DATABASE");
	const MONGODB_USERNAME = env("MONGODB_USERNAME");
	const MONGODB_PASSWORD = env("MONGODB_PASSWORD");
	const MONGODB_HOSTNAME = env("MONGODB_HOSTNAME");

	const MONGO_URI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOSTNAME}/${MONGODB_DATABASE}`;

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
