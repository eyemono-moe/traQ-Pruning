import { ContextMenu, DropdownMenu } from "@kobalte/core";
import { ChannelSubscribeLevel } from "@traptitech/traq";
import { ParentComponent } from "solid-js";
import env from "~/lib/env";
import { ChannelNode, HandleAction } from "../UI/ChannelLi";

const container =
	"min-w-[200px] p-2 bg-white dark:bg-dark-800 rounded shadow-lg dark:shadow-dark-200 outline-none font-600";
const item =
	"text-lg h-8 leading-none rounded flex items-center pl-6 pr-2 py-0 position-relative select-none outline-none data-[highlighted]:(outline-none bg-sky-600 text-white dark:(bg-sky-500 text-dark-800)) data-[disabled]:(opacity-50 cursor-not-allowed pointer-events-none) [&:not([data-highlighted])[data-expanded]]:(bg-sky-200 dark:bg-sky-900)";
const itemIndicator =
	"position-absolute left-0 h-5 w-5 inline-flex items-center justify-center";
const separator = "h-[1px] my-1 prose bg-[var(--un-prose-hr)]";
const label = "px-2 text-sm";
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

const Menu: ParentComponent<{
	type: "context" | "dropdown";
	level: ChannelSubscribeLevel;
	node: ChannelNode;
	pending?: boolean;
	handleAction: HandleAction;
}> = (props) => {
	const Component = props.type === "context" ? ContextMenu : DropdownMenu;

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
		<Component.Root>
			<Component.Trigger
				class={
					props.type === "context"
						? "w-full h-auto overflow-x-hidden"
						: "w-8 h-8 shrink-0 grid place-content-center hover:enabled:(bg-slate-200 dark:bg-dark-100) rounded transition-colors overflow-hidden data-[expanded]:(bg-slate-200 dark:bg-dark-100)"
				}
			>
				{props.children}
			</Component.Trigger>
			<Component.Portal>
				<Component.Content class={container}>
					<Component.Group>
						<Component.GroupLabel class={label}>通知設定</Component.GroupLabel>
						<Component.RadioGroup
							value={levelToValue(props.level)}
							onChange={handleChange}
							disabled={props.node.channel.force || props.pending}
						>
							<Component.RadioItem
								closeOnSelect
								class={item}
								value="none"
								disabled={props.node.channel.force || props.pending}
							>
								<Component.ItemIndicator class={itemIndicator}>
									<div class="i-material-symbols:radio-button-checked-outline" />
								</Component.ItemIndicator>
								通知なし
							</Component.RadioItem>
							<Component.RadioItem
								closeOnSelect
								class={item}
								value="notify"
								disabled={props.node.channel.force || props.pending}
							>
								<Component.ItemIndicator class={itemIndicator}>
									<div class="i-material-symbols:radio-button-checked-outline" />
								</Component.ItemIndicator>
								未読のみ管理
							</Component.RadioItem>
							<Component.RadioItem
								closeOnSelect
								class={item}
								value="subscribe"
								disabled={props.node.channel.force || props.pending}
							>
								<Component.ItemIndicator class={itemIndicator}>
									<div class="i-material-symbols:radio-button-checked-outline" />
								</Component.ItemIndicator>
								通知オン
							</Component.RadioItem>
						</Component.RadioGroup>
					</Component.Group>
					<Component.Separator class={separator} />
					<Component.Sub overlap gutter={4} shift={-8}>
						<Component.SubTrigger
							class={item}
							disabled={props.node.children.length === 0}
						>
							子階層と一括
							<div
								class={`${rightIcon} i-material-symbols:arrow-forward-ios-rounded`}
							/>
						</Component.SubTrigger>
						<Component.Portal>
							<Component.SubContent class={container}>
								<Component.Item
									closeOnSelect
									class={item}
									onSelect={() => props.handleAction(0, props.node, "children")}
								>
									通知なし
								</Component.Item>
								<Component.Item
									closeOnSelect
									class={item}
									onSelect={() => props.handleAction(1, props.node, "children")}
								>
									未読のみ管理
								</Component.Item>
								<Component.Item
									closeOnSelect
									class={item}
									onSelect={() => props.handleAction(2, props.node, "children")}
								>
									通知オン
								</Component.Item>
							</Component.SubContent>
						</Component.Portal>
					</Component.Sub>
					<Component.Sub overlap gutter={4} shift={-8}>
						<Component.SubTrigger
							class={item}
							disabled={props.node.children.length === 0}
						>
							子孫と一括
							<div
								class={`${rightIcon} i-material-symbols:arrow-forward-ios-rounded`}
							/>
						</Component.SubTrigger>
						<Component.Portal>
							<Component.SubContent class={container}>
								<Component.Item
									closeOnSelect
									class={item}
									onSelect={() => props.handleAction(0, props.node, "all")}
								>
									通知なし
								</Component.Item>
								<Component.Item
									closeOnSelect
									class={item}
									onSelect={() => props.handleAction(1, props.node, "all")}
								>
									未読のみ管理
								</Component.Item>

								<Component.Item
									closeOnSelect
									class={item}
									onSelect={() => props.handleAction(2, props.node, "all")}
								>
									通知オン
								</Component.Item>
							</Component.SubContent>
						</Component.Portal>
					</Component.Sub>
					<Component.Separator class={separator} />
					<Component.Item
						closeOnSelect
						class={item}
						onSelect={() => {
							window.open(
								`${env("TRAQ_URL")}/channels/${props.node.fullName}`,
								"_blank",
								"noopener,noreferrer",
							);
						}}
					>
						traQで開く
						<div
							class={`${rightIcon} i-material-symbols:open-in-new-rounded`}
						/>
					</Component.Item>
				</Component.Content>
			</Component.Portal>
		</Component.Root>
	);
};

export default Menu;
