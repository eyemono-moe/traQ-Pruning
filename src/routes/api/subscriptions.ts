import { ChannelSubscribeLevel } from "@traptitech/traq";
import { APIEvent, json } from "solid-start";
import { z } from "zod";
import useApi from "~/lib/useApi";

export type GetSubscriptionsRes = {
	[channelId: string]: ChannelSubscribeLevel;
};

export const GET = async (
	event: APIEvent,
): Promise<ReturnType<typeof json<ChannelSubscribeLevel>>> => {
	const api = await useApi(event.request);
	const { data: subscriptions } = await api.getMyChannelSubscriptions();
	const subscriptionDict: GetSubscriptionsRes = {};
	for (const subscription of subscriptions) {
		subscriptionDict[subscription.channelId] = subscription.level;
	}
	return json(subscriptionDict);
};

export type PutSubscriptionsReq = {
	[channelId: string]: ChannelSubscribeLevel;
};

const putBodySchema = z.object({
	levels: z.record(
		z.string(),
		z.union([z.literal(0), z.literal(1), z.literal(2)]),
	),
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const PUT = async (event: APIEvent) => {
	const api = await useApi(event.request);
	const body = await new Response(event.request.body).json();
	const payload = putBodySchema.safeParse(body);
	if (!payload.success) {
		return json(
			{
				message: "invalid request body",
				errors: payload.error.issues,
			},
			400,
		);
	}
	for (const [channelId, level] of Object.entries(payload.data.levels)) {
		const res = await api.setChannelSubscribeLevel(channelId, { level });
		await sleep(100);
	}
	return json({
		message: "ok",
	});
};
