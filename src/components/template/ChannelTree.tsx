import { Collapsible } from "@kobalte/core";
import { Channel } from "@traptitech/traq";
import { Component, For, Show, createMemo } from "solid-js";
import ChannelLi, { ChannelNode } from "../UI/ChannelLi";

const container =
	"w-full overflow-x-hidden shrink-0 flex gap-1 items-stretch hover:bg-slate-100 rounded has-[[data-expanded][id*=context],[data-expanded][id*=dropdown]]:bg-slate-100";
const hashTag =
	"font-bold w-8 m-1 h-8 grid place-content-center shrink-0 text-slate-800 text-lg";

const CollapsibleNodes: Component<{
	node: ChannelNode;
}> = (props) => {
	return (
		<Show
			when={props.node.children.length > 0}
			fallback={
				<div class={container}>
					<div class={hashTag}>#</div>
					<ChannelLi node={props.node} />
				</div>
			}
		>
			<Collapsible.Root>
				<div class={container}>
					<Collapsible.Trigger>
						<div
							class={`${hashTag} border-4 rounded border-gray-800 [[data-expanded]>&]:(bg-gray-800 text-slate-100) transition-colors`}
						>
							#
						</div>
					</Collapsible.Trigger>
					<ChannelLi node={props.node} />
				</div>
				<Collapsible.Content class="pl-2 m-0 ml-[calc(1.25rem_-_1px)] flex flex-col border-l-1 border-slate-400 animate-[slide-up_0.2s] overflow-hidden data-[expanded]:(animate-[slide-down_0.2s])">
					<For each={props.node.children}>
						{(child) => <CollapsibleNodes node={child} />}
					</For>
				</Collapsible.Content>
			</Collapsible.Root>
		</Show>
	);
};

const ChannelTree: Component<{
	channels: Channel[];
}> = (props) => {
	const channelMap = createMemo(() => {
		const map = new Map<string, Channel>();
		for (const channel of props.channels) {
			if (channel.archived) continue;
			map.set(channel.id, channel);
		}
		return map;
	});

	const createNode = (
		parentName: string,
		channel: Channel,
		sep = "/",
	): ChannelNode => {
		const fullName = `${parentName}${sep}${channel.name}`;

		return {
			fullName,
			channel: channel,
			children: channel.children
				.reduce<ChannelNode[]>((acc, childId) => {
					const child = channelMap().get(childId);
					if (child) {
						// 子チャンネルがアーカイブされている場合等
						acc.push(createNode(fullName, child));
					}
					return acc;
				}, [])
				.sort((a, b) => a.fullName.localeCompare(b.fullName)),
		};
	};

	const rootNodes = createMemo(() => {
		const rootChannels = props.channels
			.filter((c) => c.parentId === null)
			.sort((a, b) => a.name.localeCompare(b.name));
		return rootChannels.map((c) => createNode("", c, ""));
	});

	return (
		<div class="w-full overflow-hidden flex flex-col">
			<For each={rootNodes()}>{(node) => <CollapsibleNodes node={node} />}</For>
		</div>
	);
};

export default ChannelTree;
