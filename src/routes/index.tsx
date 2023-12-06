import { Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import ChannelTree from "~/components/template/ChannelTree";
import useApi from "~/lib/useApi";

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
	const subscriptions = createServerData$(async (_, event) => {
		const api = await useApi(event.request);
		const { data: subscriptions } = await api.getMyChannelSubscriptions();
		return subscriptions;
	});

	return { me, channels, subscriptions };
};

export default function Page() {
	const { channels } = useRouteData<typeof routeData>();

	return (
		<main>
			<Show when={channels()}>
				<ChannelTree channels={channels()!} />
			</Show>
		</main>
	);
}
