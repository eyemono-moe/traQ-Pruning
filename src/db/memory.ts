import { SessionDB, UserSession } from ".";

let db: UserSession[] = [];

export const memorySessionDb: SessionDB = {
	async get(userId) {
		return db.find((session) => session.userId === userId) || null;
	},
	async delete(userId) {
		db = db.filter((session) => session.userId !== userId);
	},
	async set(userId, token) {
		this.delete(userId);
		db.push({ userId, token });
	},
};
