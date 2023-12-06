import { Apis, Configuration } from "@traptitech/traq";
import { type APIEvent, redirect } from "solid-start/api";
import env from "~/lib/env";
import { session } from "~/lib/session";

export const GET = async (event: APIEvent) => {
	const code = new URL(event.request.url).searchParams.get("code");
	if (!code) {
		return redirect("/api/login");
	}
	const clientId = env("TRAQ_CLIENT_ID");
	const api = new Apis();
	const { data: token } = await api.postOAuth2Token(
		"authorization_code",
		code,
		undefined,
		clientId,
	);
	const loggedInApi = new Apis(
		new Configuration({
			accessToken: token.access_token,
		}),
	);
	const { data: user } = await loggedInApi.getMe();
	return await session.createSessionData(user.id, token.access_token);
};
