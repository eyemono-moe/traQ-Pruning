import env from "~/lib/env";
import { memorySessionDb } from "./memory";
import { mongoSessionDb } from "./mongo";

export interface UserSession {
	userId: string;
	token: string;
}

export interface SessionDB {
	get: (userId: string) => Promise<UserSession | null>;
	set: (userId: string, token: string) => Promise<void>;
	delete: (userId: string) => Promise<void>;
}

export const db: SessionDB =
	env("NODE_ENV") === "production" ? mongoSessionDb : memorySessionDb;
