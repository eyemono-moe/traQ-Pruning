import { ContextMenu } from "@kobalte/core";
import { ChannelSubscribeLevel } from "@traptitech/traq";
import { ParentComponent } from "solid-js";
import { A } from "solid-start";
import { ChannelNode, HandleAction } from "../UI/ChannelLi";

const container =
	"min-w-[200px] p-2 bg-white rounded border-1 shadow outline-none";
const item =
	"text-lg h-8 leading-none rounded flex items-center h-4 pl-6 pr-2 py-0 position-relative select-none outline-none data-[highlighted]:(outline-none bg-sky-500 text-white) data-[disabled]:(opacity-50 cursor-not-allowed pointer-events-none)";
const itemIndicator =
	"position-absolute left-0 h-5 w-5 inline-flex items-center justify-center";
const subTrigger = "data-[expanded]:(bg-sky-200 text-sky-900)";
const separator = "h-[1px] my-1 border-t-[1px] border-slate-400";
const label = "text-base text-slate-600 px-2 text-sm";
const rightIcon = "ml-auto pl-5 [[data-highlighted]>&:(text-white)]";

const levelToValue = (
	level: ChannelSubscribeLevel,
): "none" | "notify" | "subscribe" => {
	switch (level) {
		case 0:
			return "none";
		case 1:
			return "notify";
		case 2:
			return "subscribe";
	}
};

const ChannelContextMenu: ParentComponent<{
	level: ChannelSubscribeLevel;
	node: ChannelNode;
	pending?: boolean;
	handleAction: HandleAction;
}> = (props) => {
	const handleChange = (value: string) => {
		switch (value) {
			case "none":
				props.handleAction(0, props.node);
				break;
			case "notify":
				props.handleAction(1, props.node);
				break;
			case "subscribe":
				props.handleAction(2, props.node);
				break;
			default:
				throw new Error(`invalid value: ${value}`);
		}
	};

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger class="w-full h-full overflow-x-hidden">
				{props.children}
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Content class={container}>
					<ContextMenu.Group>
						<ContextMenu.GroupLabel class={label}>
							通知設定
						</ContextMenu.GroupLabel>
						<ContextMenu.RadioGroup
							value={levelToValue(props.level)}
							onChange={handleChange}
							disabled={props.node.channel.force || props.pending}
						>
							<ContextMenu.RadioItem
								class={item}
								value="none"
								disabled={props.node.channel.force || props.pending}
							>
								<ContextMenu.ItemIndicator class={itemIndicator}>
									<div class="i-material-symbols:radio-button-checked-outline" />
								</ContextMenu.ItemIndicator>
								なし
							</ContextMenu.RadioItem>
							<ContextMenu.RadioItem
								class={item}
								value="notify"
								disabled={props.node.channel.force || props.pending}
							>
								<ContextMenu.ItemIndicator class={itemIndicator}>
									<div class="i-material-symbols:radio-button-checked-outline" />
								</ContextMenu.ItemIndicator>
								未読のみ管理
							</ContextMenu.RadioItem>
							<ContextMenu.RadioItem
								class={item}
								value="subscribe"
								disabled={props.node.channel.force || props.pending}
							>
								<ContextMenu.ItemIndicator class={itemIndicator}>
									<div class="i-material-symbols:radio-button-checked-outline" />
								</ContextMenu.ItemIndicator>
								通知オン
							</ContextMenu.RadioItem>
						</ContextMenu.RadioGroup>
					</ContextMenu.Group>
					<ContextMenu.Separator class={separator} />
					<ContextMenu.Sub overlap gutter={4} shift={-8}>
						<ContextMenu.SubTrigger
							class={`${item} ${subTrigger}`}
							disabled={props.node.children.length === 0}
						>
							子階層一括
							<div
								class={`${rightIcon} i-material-symbols:arrow-forward-ios-rounded`}
							/>
						</ContextMenu.SubTrigger>
						<ContextMenu.Portal>
							<ContextMenu.SubContent class={container}>
								<ContextMenu.Item
									class={item}
									onSelect={() => props.handleAction(0, props.node, "children")}
								>
									なし
								</ContextMenu.Item>
								<ContextMenu.Item
									class={item}
									onSelect={() => props.handleAction(1, props.node, "children")}
								>
									未読のみ管理
								</ContextMenu.Item>
								<ContextMenu.Item
									class={item}
									onSelect={() => props.handleAction(2, props.node, "children")}
								>
									通知オン
								</ContextMenu.Item>
							</ContextMenu.SubContent>
						</ContextMenu.Portal>
					</ContextMenu.Sub>
					<ContextMenu.Sub overlap gutter={4} shift={-8}>
						<ContextMenu.SubTrigger
							class={`${item} ${subTrigger}`}
							disabled={props.node.children.length === 0}
						>
							子孫一括
							<div
								class={`${rightIcon} i-material-symbols:arrow-forward-ios-rounded`}
							/>
						</ContextMenu.SubTrigger>
						<ContextMenu.Portal>
							<ContextMenu.SubContent class={container}>
								<ContextMenu.Item
									class={item}
									onSelect={() => props.handleAction(0, props.node, "all")}
								>
									なし
								</ContextMenu.Item>
								<ContextMenu.Item
									class={item}
									onSelect={() => props.handleAction(1, props.node, "all")}
								>
									未読のみ管理
								</ContextMenu.Item>

								<ContextMenu.Item
									class={item}
									onSelect={() => props.handleAction(2, props.node, "all")}
								>
									通知オン
								</ContextMenu.Item>
							</ContextMenu.SubContent>
						</ContextMenu.Portal>
					</ContextMenu.Sub>
					<ContextMenu.Separator class={separator} />
					<ContextMenu.Item
						class={item}
						onSelect={() => {
							window.open(
								`https://q.trap.jp/channels/${props.node.fullName}`,
								"_blank",
								"noopener,noreferrer",
							);
						}}
					>
						traQで開く
						<div
							class={`${rightIcon} i-material-symbols:open-in-new-rounded`}
						/>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	);
};

export default ChannelContextMenu;
