import { Apis, Configuration } from "@traptitech/traq";
import { redirect } from "solid-start";
import { session } from "./session";

const useApi = async (request: Request) => {
	const sessionData = await session.getSessionData(request);
	if (!sessionData) {
		throw redirect("/api/login");
	}
	const api = new Apis(
		new Configuration({
			accessToken: sessionData.token,
		}),
	);
	return api;
};

export default useApi;
