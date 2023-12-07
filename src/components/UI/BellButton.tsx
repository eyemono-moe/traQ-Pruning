import { ChannelSubscribeLevel } from "@traptitech/traq";
import { Component, JSX } from "solid-js";

const BellButton: Component<{
	level: ChannelSubscribeLevel;
	forceNotified?: boolean;
	pending?: boolean;
	handleUnsubscribe: () => void;
	handleNotified: () => void;
	handleSubscribe: () => void;
}> = (props) => {
	const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
		e.stopPropagation();
		if (props.pending) return;
		if (props.level === 0) {
			props.handleNotified();
		} else if (props.level === 1) {
			props.handleSubscribe();
		} else {
			props.handleUnsubscribe();
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			class={`w-8 h-8 grid place-content-center hover:bg-slate-200 rounded transition-colors duration-200
      ${props.pending ? "animate-pulse cursor-wait" : ""} ${
				props.forceNotified ? "cursor-not-allowed" : ""
			}`}
			disabled={props.forceNotified || props.pending}
		>
			<div
				class={`w-6 h-6 color-gray-800 ${
					props.forceNotified
						? // 強制通知
						  "i-material-symbols:notifications-rounded color-gray-400"
						: props.level === 0
						  ? // 購読無し
							  "i-material-symbols:notifications-outline-rounded"
						  : props.level === 1
							  ? // 未読管理
								  'i-material-symbols:notifications-outline-rounded after:content-[""] after:absolute after:inset-0 after:rounded-full after:bg-slate-400'
							  : // 未読管理+通知
								  "i-material-symbols:notifications-rounded"
				}`}
			/>
		</button>
	);
};

export default BellButton;
