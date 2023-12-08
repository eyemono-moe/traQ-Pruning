import { ChannelSubscribeLevel } from "@traptitech/traq";
import { Component, JSX } from "solid-js";
import { ChannelNode, HandleAction } from "./ChannelLi";

const BellButton: Component<{
	level: ChannelSubscribeLevel;
	node: ChannelNode;
	pending?: boolean;
	handleAction: HandleAction;
}> = (props) => {
	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		e.stopPropagation();
		if (props.pending) return;
		switch (props.level) {
			case 0:
				props.handleAction(1, props.node);
				break;
			case 1:
				props.handleAction(2, props.node);
				break;
			case 2:
				props.handleAction(0, props.node);
				break;
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			class={`w-8 h-8 shrink-0 grid place-content-center hover:enabled:bg-sky-200 hover:disabled:bg-gray-200 rounded transition-colors duration-200 overflow-hidden ${
				props.pending ? "cursor-wait" : ""
			} ${props.node.channel.force ? "cursor-not-allowed" : ""}`}
			disabled={props.node.channel.force || props.pending}
			title={
				props.node.channel.force
					? "強制通知のため変更できません"
					: props.level === 0
					  ? "通知しない"
					  : props.level === 1
						  ? "未読管理"
						  : "未読管理+通知"
			}
		>
			<div
				class={`w-6 h-6 color-gray-800 ${
					props.node.channel.force
						? // 強制通知
						  "i-material-symbols:notifications-rounded opacity-50"
						: props.level === 0
						  ? // 購読無し
							  "i-material-symbols:notifications-outline-rounded"
						  : props.level === 1
							  ? // 未読管理
								  "i-custom:notifications-dot"
							  : // 未読管理+通知
								  "i-material-symbols:notifications-rounded"
				} ${
					props.pending
						? "animate-[shake-small_1.4s_ease-in-out_infinite] "
						: ""
				}`}
			/>
		</button>
	);
};

export default BellButton;
