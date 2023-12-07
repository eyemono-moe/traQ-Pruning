import { Channel, ChannelSubscribeLevel } from "@traptitech/traq";
import { Component, Show } from "solid-js";
import { createMemo } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import { isMobile } from "~/contexts/isMobile";
import useApi from "~/lib/useApi";
import { routeData } from "~/routes";
import ChannelContextMenu from "../template/ChannelContextMenu";
import BellButton from "./BellButton";

export type ChannelNode = {
	fullName: string;
	channel: Channel;
	children: ChannelNode[];
};

export const getChildNodes = (
	node: ChannelNode,
	includeGrandChildren = false,
): Channel["id"][] => {
	const children = node.children.flatMap((child) => [
		child.channel.id,
		...(includeGrandChildren ? getChildNodes(child, true) : []),
	]);
	return children;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type HandleAction = (
	level: ChannelSubscribeLevel,
	channel: ChannelNode,
	type?: "single" | "children" | "all",
) => void;

const ChannelLi: Component<{
	node: ChannelNode;
}> = (props) => {
	const { subscriptions } = useRouteData<typeof routeData>();

	const [enrolling, enroll] = createServerAction$(
		async (
			payload: {
				level: ChannelSubscribeLevel;
				channels: Channel["id"][];
			},
			event,
		) => {
			try {
				const api = await useApi(event.request);
				for (const channelId of payload.channels) {
					await api.setChannelSubscribeLevel(channelId, {
						level: payload.level,
					});
					await sleep(100);
				}
			} catch (e) {
				console.error(e);
			}
			return;
		},
		{
			invalidate: ["subscriptions"],
		},
	);

	const handleAction = (
		level: ChannelSubscribeLevel,
		channel: ChannelNode,
		type: "single" | "children" | "all" = "single",
	) => {
		let targetChannels: Channel["id"][];
		switch (type) {
			case "single":
				targetChannels = [channel.channel.id];
				break;
			case "children":
				targetChannels = getChildNodes(channel, false);
				break;
			case "all":
				targetChannels = getChildNodes(channel, true);
				break;
		}

		// calc diff and update only changed channels
		const oldSubscriptions = subscriptions();

		if (oldSubscriptions) {
			targetChannels = targetChannels.filter(
				(channelId) => oldSubscriptions[channelId] !== level,
			);
		}

		return enroll({
			level,
			channels: targetChannels,
		});
	};

	const displayLevel = createMemo(
		() =>
			(enrolling.pending
				? enrolling.input?.level
				: subscriptions()?.[props.node.channel.id]) ?? 0,
	);

	return (
		<ChannelContextMenu
			node={props.node}
			pending={enrolling.pending}
			level={displayLevel()}
			handleAction={handleAction}
		>
			<div class="w-full h-full overflow-x-hidden flex gap-2 text-slate-950 items-center">
				<div class="font-bold">
					<Show when={isMobile()} fallback={props.node.fullName}>
						{props.node.channel.name}
					</Show>
				</div>
				<Show when={subscriptions()}>
					<BellButton
						pending={enrolling.pending}
						level={displayLevel()}
						node={props.node}
						handleAction={handleAction}
					/>
				</Show>
				<span class="text-sm text-slate-600 truncate">
					{props.node.channel.topic}
				</span>
			</div>
		</ChannelContextMenu>
	);
};

export default ChannelLi;
