import { Channel } from "@traptitech/traq";
import { Component, For, Show, createMemo } from "solid-js";

type ChannelNode = {
	fullName: string;
	channelId: string;
	children: ChannelNode[];
};

const _ChannelNode: Component<{
	node: ChannelNode;
}> = (props) => {
	return (
		<div>
			{props.node.fullName}
			<Show when={props.node.children.length > 0}>
				<ul>
					<For each={props.node.children}>
						{(child) => <_ChannelNode node={child} />}
					</For>
				</ul>
			</Show>
		</div>
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
			channelId: channel.id,
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
		return rootChannels.map((c) => createNode("#", c, ""));
	});

	return <For each={rootNodes()}>{(node) => <_ChannelNode node={node} />}</For>;
};

export default ChannelTree;
