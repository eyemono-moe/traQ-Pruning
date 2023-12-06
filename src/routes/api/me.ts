import { Apis, Configuration } from "@traptitech/traq";
import { redirect } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { session } from "~/lib/session";

export const routeData = () => {
	return createServerData$(async (_, event) => {
		const sessionData = await session.getSessionData(event.request);
		if (!sessionData) {
			throw redirect("/login");
		}
		const api = new Apis(
			new Configuration({
				accessToken: sessionData.token,
			}),
		);
		const { data: me } = await api.getMe();
		return me;
	});
};
