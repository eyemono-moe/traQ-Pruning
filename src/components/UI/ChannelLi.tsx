import { Channel, ChannelSubscribeLevel } from "@traptitech/traq";
import { Component, Show } from "solid-js";
import { createRouteAction, useRouteData } from "solid-start";
import { BASE, routeData } from "~/routes";
import ChannelContextMenu from "../template/ChannelContextMenu";
import BellButton from "./BellButton";

export type ChannelNode = {
	fullName: string;
	channel: Channel;
	children: ChannelNode[];
};

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
			await fetch(`${BASE}/api/subscriptions`, {
				body: JSON.stringify(payload),
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-cache",
			});
		},
		{
			invalidate: ["channels", "me"],
		},
	);

	return (
		<ChannelContextMenu>
			<div class="w-full h-full overflow-x-hidden flex gap-2 text-gray-950 items-center">
				<div class="font-bold">{props.node.fullName}</div>
				<Show when={subscriptions()}>
					<BellButton
						pending={enrolling.pending}
						level={
							enrolling.pending
								? enrolling.input?.levels[props.node.channel.id] ?? 0
								: subscriptions()![props.node.channel.id]
						}
						forceNotified={props.node.channel.force}
						handleUnsubscribe={() => {
							enroll({
								levels: {
									[props.node.channel.id]: 0,
								},
							});
						}}
						handleNotified={() => {
							enroll({
								levels: {
									[props.node.channel.id]: 1,
								},
							});
						}}
						handleSubscribe={() => {
							enroll({
								levels: {
									[props.node.channel.id]: 2,
								},
							});
						}}
					/>
				</Show>
				<span class="text-sm text-gray-600 truncate">
					{props.node.channel.id}
				</span>
			</div>
		</ChannelContextMenu>
	);
};

export default ChannelLi;
