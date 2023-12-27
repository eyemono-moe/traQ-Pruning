import { Apis, Configuration } from "@traptitech/traq";
import { type APIEvent, redirect } from "solid-start/api";
import env from "~/lib/env";
import { getCodeVerifier, session } from "~/lib/session";

export const GET = async (event: APIEvent) => {
	const code = new URL(event.request.url).searchParams.get("code");
	const codeVerifier = await getCodeVerifier(event.request);
	if (!code || !codeVerifier) {
		return redirect("/api/login");
	}
	const clientId = env("TRAQ_CLIENT_ID");
	const api = new Apis(
		new Configuration({
			basePath: env("VITE_API_BASE_URL"),
		}),
	);
	const { data: token } = await api.postOAuth2Token(
		"authorization_code",
		code,
		undefined,
		clientId,
		codeVerifier,
	);
	const loggedInApi = new Apis(
		new Configuration({
			basePath: env("VITE_API_BASE_URL"),
			accessToken: token.access_token,
		}),
	);
	const { data: user } = await loggedInApi.getMe();
	return await session.createSessionData(user.id, token.access_token);
};
