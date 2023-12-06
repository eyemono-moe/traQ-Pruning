import { Apis, Configuration } from "@traptitech/traq";
import { redirect } from "solid-start";
import { Middleware } from "solid-start/entry-server";
import { session } from "./session";

const isLogin = async (request: Request) => {
	const sessionData = await session.getSessionData(request);
	if (!sessionData) return false;
	try {
		const { token } = sessionData;
		const api = new Apis(
			new Configuration({
				accessToken: token,
			}),
		);
		const res = await api.getMe();
		return res.status === 200;
	} catch (e) {
		return false;
	}
};

const uncheckedPaths = ["/api/login", "/api/logout", "/api/callback"];

export const checkLoginMiddleware: Middleware = ({ forward }) => {
	return async (event) => {
		if (uncheckedPaths.includes(new URL(event.request.url).pathname)) {
			return forward(event);
		}
		const _isLogin = await isLogin(event.request);
		if (!_isLogin) {
			return redirect("/api/login");
		}
		return forward(event);
	};
};
