import { Image } from "@kobalte/core";
import { Show } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import ChannelTree from "~/components/template/ChannelTree";
import { GetChannelsRes } from "./api/channels";
import { GetMeRes } from "./api/me";
import { GetSubscriptionsRes } from "./api/subscriptions";

export const BASE = import.meta.env.DEV
	? "http://localhost:3000"
	: "https://pruning.trap.show";

export const routeData = () => {
	const me = createRouteData(
		async () => {
			const res = await fetch(`${BASE}/api/me`);
			return (await res.json()) as GetMeRes;
		},
		{ key: "me" },
	);
	const channels = createRouteData(
		async () => {
			const res = await fetch(`${BASE}/api/channels`);
			return (await res.json()) as GetChannelsRes;
		},
		{ key: "channels" },
	);
	const subscriptions = createRouteData(
		async () => {
			const res = await fetch(`${BASE}/api/subscriptions`);
			return (await res.json()) as GetSubscriptionsRes;
		},
		{ key: "subscriptions" },
	);

	return { me, channels, subscriptions };
};

export default function Page() {
	const { me, channels } = useRouteData<typeof routeData>();

	return (
		<main
			class="text-base prose text-slate-950 max-w-full w-full h-full flex justify-center overflow-y-auto overflow-x-hidden p-4"
			style={{ "scrollbar-gutter": "stable" }}
		>
			<div class="w-full max-w-[1000px]">
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
			</div>
		</main>
	);
}
