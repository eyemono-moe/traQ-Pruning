import { redirect } from "solid-start";
import { type APIEvent } from "solid-start/api";
import env from "~/lib/env";
import { session } from "~/lib/session";

export const GET = async (event: APIEvent) => {
	const sessionData = await session.getSessionData(event.request);
	if (sessionData) {
		session.deleteSessionData(event.request, sessionData.userId, "/login");
	}
	const clientId = env("TRAQ_CLIENT_ID");
	const redirectBaseUrl = "https://q.trap.jp/api/v3/oauth2/authorize";
	const params = new URLSearchParams({
		client_id: clientId,
		response_type: "code",
	});
	const redirectUrl = `${redirectBaseUrl}?${params.toString()}`;
	return redirect(redirectUrl);
};
