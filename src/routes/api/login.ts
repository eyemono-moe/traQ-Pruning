import pkceChallenge from "pkce-challenge";
import { type APIEvent } from "solid-start/api";
import env from "~/lib/env";
import { session, setCodeVerifierAndRedirect } from "~/lib/session";

export const GET = async (event: APIEvent) => {
	const sessionData = await session.getSessionData(event.request);
	if (sessionData) {
		session.deleteSessionData(event.request, sessionData.userId, "/api/login");
	}

	const challenge = await pkceChallenge();

	const clientId = env("TRAQ_CLIENT_ID");
	const redirectBaseUrl = `${env("API_BASE_URL")}/oauth2/authorize`;
	const params = new URLSearchParams({
		client_id: clientId,
		response_type: "code",
		code_challenge: challenge.code_challenge,
		code_challenge_method: "S256",
	});
	const redirectUrl = `${redirectBaseUrl}?${params.toString()}`;
	return setCodeVerifierAndRedirect(
		event.request,
		challenge.code_verifier,
		redirectUrl,
	);
};
