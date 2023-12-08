import { Image } from "@kobalte/core";
import { ChannelSubscribeLevel } from "@traptitech/traq";
import { Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Toaster } from "solid-toast";
import ChannelTree from "~/components/template/ChannelTree";
import useApi from "~/lib/useApi";

export const BASE = import.meta.env.DEV
	? "http://localhost:3000"
	: "https://bell.trap.show";

export const routeData = () => {
	const me = createServerData$(async (_, event) => {
		const api = await useApi(event.request);
		const { data: me } = await api.getMe();
		return me;
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
	const { me, channels } = useRouteData<typeof routeData>();

	return (
		<main
			class="text-base prose text-slate-950 max-w-full w-full flex justify-center overflow-y-auto overflow-x-hidden p-4"
			style={{ "scrollbar-gutter": "stable" }}
		>
			<div class="w-full h-full overflow-y-hidden max-w-[1000px]">
				<div class="flex items-center flex-wrap mb-8">
					<div class="flex items-baseline gap-2">
						<h1>Q Bell</h1>
						<p class="text-slate-600">traQの通知編集アプリ</p>
					</div>
					<Show when={me()}>
						<div class="flex items-center gap-2 ml-auto text-slate-600">
							logged in as {me()!.name}
							<Image.Root
								fallbackDelay={600}
								class="inline-flex items-center justify-center align-middle w-8 h-8 rounded-full overflow-hidden select-none"
							>
								<Image.Img
									src={`https://q.trap.jp/api/v3/public/icon/${me()!.name}`}
									alt={`${me()!.name} icon`}
								/>
								<Image.Fallback class="w-full h-full flex items-center justify-center bg-sky-500 text-white text-xl font-bold">
									{me()!.name.charAt(0)}
								</Image.Fallback>
							</Image.Root>
						</div>
					</Show>
				</div>
				<Show when={channels()}>
					<ChannelTree channels={channels()!} />
				</Show>
				<Toaster position="bottom-right" />
			</div>
		</main>
	);
}
