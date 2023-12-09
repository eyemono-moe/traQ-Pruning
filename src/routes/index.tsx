import { ChannelSubscribeLevel } from "@traptitech/traq";
import { Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Header from "~/components/layout/Header";
import ChannelTree from "~/components/template/ChannelTree";
import useApi from "~/lib/useApi";

export const BASE = import.meta.env.DEV
	? "http://localhost:3000"
	: "https://bell.trap.show";

export const routeData = () => {
	const me = createServerData$(async (_, event) => {
		const api = await useApi(event.request);
		const { data: me } = await api.getMe();
		return {
			name: me.name,
		};
	});
	const channels = createServerData$(async (_, event) => {
		const api = await useApi(event.request);
		const { data: channels } = await api.getChannels(false);
		return channels.public.filter((c) => !c.archived);
	});
	const subscriptions = createServerData$(
		async (_, event) => {
			const api = await useApi(event.request);
			const { data: subscriptions } = await api.getMyChannelSubscriptions();
			const subscriptionDict: {
				[channelId: string]: ChannelSubscribeLevel;
			} = {};
			for (const subscription of subscriptions) {
				subscriptionDict[subscription.channelId] = subscription.level;
			}
			return subscriptionDict;
		},
		{ key: "subscriptions" },
	);

	return { me, channels, subscriptions };
};

export default function Page() {
	const { channels } = useRouteData<typeof routeData>();

	return (
		<main class="w-full min-h-100vh p-4 overflow-y-auto overflow-x-hidden grid gap-4 grid-rows-[auto_1fr] justify-items-center">
			<Header />
			<div class="w-full max-w-1000px overflow-x-hidden">
				<Show when={channels()}>
					<ChannelTree channels={channels()!} />
				</Show>
			</div>
		</main>
	);
}
