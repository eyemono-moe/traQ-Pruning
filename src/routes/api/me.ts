import { MyUserDetail } from "@traptitech/traq";
import { APIEvent, json } from "solid-start";
import useApi from "~/lib/useApi";

export type GetMeRes = MyUserDetail;

export const GET = async (
	event: APIEvent,
): Promise<ReturnType<typeof json<GetMeRes>>> => {
	const api = await useApi(event.request);
	const { data: me } = await api.getMe();
	return json(me);
};
