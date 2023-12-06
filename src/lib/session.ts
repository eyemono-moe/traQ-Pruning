import { request } from "http";
import { createCookieSessionStorage, redirect } from "solid-start";
import { SessionDB } from "~/db";
import { memorySessionDb } from "~/db/memory";
import { mongoSessionDb } from "~/db/mongo";
import env from "./env";

const storage = createCookieSessionStorage({
	cookie: {
		name: "session",
		secure: env("NODE_ENV") === "production",
		secrets: [env("SESSION_SECRET")],
		maxAge: 60 * 60 * 24 * 7, // 1 week
	},
});

const getUserSession = async (request: Request) => {
	return storage.getSession(request.headers.get("Cookie"));
};

/**
 * get user id from session
 *
 * @param request
 * @returns user id or null
 */
const getUserId = async (request: Request) => {
	const session = await getUserSession(request);
	const userId = session.get("userId");
	if (!userId || typeof userId !== "string") return null;
	return userId;
};

const getSessionData = async (request: Request, db: SessionDB) => {
	const userId = await getUserId(request);
	if (!userId) return null;
	return db.get(userId);
};

const createSession = async (userId: string, redirectTo = "/") => {
	const session = await storage.getSession();
	session.set("userId", userId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await storage.commitSession(session),
		},
	});
};

const createSessionData = async (
	userId: string,
	token: string,
	db: SessionDB,
	redirectTo = "/",
) => {
	await db.set(userId, token);
	return createSession(userId, redirectTo);
};

const deleteSession = async (request: Request, redirectTo = "/") => {
	const session = await getUserSession(request);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
};

const deleteSessionData = async (
	request: Request,
	userId: string,
	db: SessionDB,
	redirectTo = "/",
) => {
	await db.delete(userId);
	return deleteSession(request, redirectTo);
};

const sessionFactory = (db: SessionDB) => ({
	getSessionData: (request: Request) => getSessionData(request, db),
	createSessionData: (userId: string, token: string, redirectTo = "/") =>
		createSessionData(userId, token, db, redirectTo),
	deleteSessionData: (request: Request, userId: string, redirectTo = "/") =>
		deleteSessionData(request, userId, db, redirectTo),
});

export const session = sessionFactory(
	env("NODE_ENV") === "production" ? mongoSessionDb : memorySessionDb,
);
