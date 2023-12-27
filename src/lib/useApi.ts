import { Apis, Configuration } from "@traptitech/traq";
import { json } from "solid-start";
import env from "./env";
import { session } from "./session";

const useApi = async (request: Request) => {
	const sessionData = await session.getSessionData(request);
	if (!sessionData) {
		throw json({ error: "Not logged in" }, 401);
	}
	const api = new Apis(
		new Configuration({
			basePath: env("VITE_API_BASE_URL"),
			accessToken: sessionData.token,
		}),
	);
	return api;
};

export default useApi;
