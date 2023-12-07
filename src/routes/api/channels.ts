import { Channel } from "@traptitech/traq";
import { APIEvent, json } from "solid-start";
import useApi from "~/lib/useApi";

export type GetChannelsRes = Channel[];

export const GET = async (
	event: APIEvent,
): Promise<ReturnType<typeof json<GetChannelsRes>>> => {
	const api = await useApi(event.request);
	const { data: channels } = await api.getChannels(false);
	return json(channels.public.filter((c) => !c.archived));
};
