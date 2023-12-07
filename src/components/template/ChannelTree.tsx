import { Collapsible } from "@kobalte/core";
import { Channel } from "@traptitech/traq";
import { Component, For, Show, createMemo } from "solid-js";
import { isMobile } from "~/contexts/isMobile";
import ChannelLi, { ChannelNode } from "../UI/ChannelLi";

const CollapsibleNodes: Component<{
	node: ChannelNode;
}> = (props) => {
	return (
		<Show
			when={props.node.children.length > 0}
			fallback={
				<div class="w-full overflow-x-hidden shrink-0 flex gap-1 items-center hover:bg-slate-100 rounded">
					<div class="font-bold m-1 w-8 h-8 grid place-content-center">#</div>
					<ChannelLi node={props.node} />
				</div>
			}
		>
			<Collapsible.Root>
				<div class="w-full overflow-x-hidden shrink-0 flex gap-1 items-center hover:bg-slate-100 rounded">
					<Collapsible.Trigger>
						<div class="font-bold m-1 w-8 h-8 text-gray-800 text-lg grid place-content-center [[data-expanded]>&]:(bg-gray-800 text-gray-100) border-4 rounded border-gray-800 box-border">
							#
						</div>
					</Collapsible.Trigger>
					<ChannelLi node={props.node} />
				</div>
				<Collapsible.Content class="pl-2 m-0 ml-[calc(1.25rem_-_1px)] flex flex-col border-l-1 border-slate-400 animate-[slideUp] overflow-hidden animate-duration-150 data-[expanded]:(animate-[slideDown] animate-duration-150) ">
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
		showFullName = true,
	): ChannelNode => {
		const name = showFullName
			? `${parentName}${sep}${channel.name}`
			: `${channel.name}`;

		return {
			fullName: name,
			channel: channel,
			children: channel.children
				.reduce<ChannelNode[]>((acc, childId) => {
					const child = channelMap().get(childId);
					if (child) {
						// 子チャンネルがアーカイブされている場合等
						acc.push(createNode(name, child, sep, showFullName));
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
		return rootChannels.map((c) => createNode("", c, "", !isMobile()));
	});

	return (
		<div class="m-0 flex flex-col">
			<For each={rootNodes()}>{(node) => <CollapsibleNodes node={node} />}</For>
		</div>
	);
};

export default ChannelTree;
