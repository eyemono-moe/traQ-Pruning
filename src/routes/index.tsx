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
		<main class="text-base prose max-w-full">
			<h1>traQ Pruning</h1>
			<p>
				通知の剪定アプリです。
				<Show when={me()}>
					<div>logged in as {me()!.name}</div>
				</Show>
			</p>
			<Show when={channels()}>
				<ChannelTree channels={channels()!} />
			</Show>
		</main>
	);
}
