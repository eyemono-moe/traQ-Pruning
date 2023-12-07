import { Channel, ChannelSubscribeLevel } from "@traptitech/traq";
import { Component, Show } from "solid-js";
import { createMemo } from "solid-js";
import { createRouteAction, useRouteData } from "solid-start";
import { isMobile } from "~/contexts/isMobile";
import { BASE, routeData } from "~/routes";
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

export type HandleAction = (
	level: ChannelSubscribeLevel,
	channel: ChannelNode,
	type?: "single" | "children" | "all",
) => void;

const ChannelLi: Component<{
	node: ChannelNode;
}> = (props) => {
	const { subscriptions } = useRouteData<typeof routeData>();

	const [enrolling, enroll] = createRouteAction(
		async (payload: {
			levels: {
				[channelId: string]: ChannelSubscribeLevel;
			};
		}) => {
			return await fetch(`${BASE}/api/subscriptions`, {
				body: JSON.stringify(payload),
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-cache",
			});
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
		let levels: { [channelId: string]: ChannelSubscribeLevel };
		const oldSubscriptions = subscriptions();

		if (oldSubscriptions) {
			levels = Object.fromEntries(
				targetChannels.reduce<[string, ChannelSubscribeLevel][]>(
					(acc, channelId) => {
						const oldLevel = oldSubscriptions?.[channelId] ?? 0;
						if (oldLevel !== level) {
							acc.push([channelId, level]);
						}
						return acc;
					},
					[],
				),
			);
		} else {
			levels = Object.fromEntries(
				targetChannels.map((channelId) => [channelId, level]),
			);
		}

		return enroll({ levels });
	};

	const displayLevel = createMemo(
		() =>
			(enrolling.pending
				? enrolling.input?.levels[props.node.channel.id]
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
