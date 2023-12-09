import { Channel, ChannelSubscribeLevel } from "@traptitech/traq";
import { Component, Show, createSignal } from "solid-js";
import { createMemo } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerAction$ } from "solid-start/server";
import toast from "solid-toast";
import { isMobile } from "~/contexts/isMobile";
import { usePending } from "~/contexts/pending";
import useApi from "~/lib/useApi";
import useModal from "~/lib/useModal";
import { routeData } from "~/routes";
import Menu from "../template/Menu";
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
	const { setPending, clearPending, pendingLevel } = usePending;

	const [_, enroll] = createServerAction$(
		async (
			payload: {
				level: ChannelSubscribeLevel;
				channels: Channel["id"][];
			},
			event,
		) => {
			const api = await useApi(event.request);
			for (const channelId of payload.channels) {
				try {
					await api.setChannelSubscribeLevel(channelId, {
						level: payload.level,
					});
				} catch (e) {
					console.error(e);
				}
				await sleep(100);
			}
			return;
		},
		{
			invalidate: ["subscriptions"],
		},
	);

	const toastHandler = (promise: Promise<unknown>, count: number) => {
		toast.promise(promise, {
			loading: `updating ${count} channels...`,
			success: "updated successfully",
			error: "failed to update",
		});
	};

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
				targetChannels = getChildNodes(channel, false).concat(
					channel.channel.id,
				);
				break;
			case "all":
				targetChannels = getChildNodes(channel, true).concat(
					channel.channel.id,
				);
				break;
		}

		// calc diff and update only changed channels
		const oldSubscriptions = subscriptions();

		if (oldSubscriptions) {
			targetChannels = targetChannels.filter(
				(channelId) => oldSubscriptions[channelId] !== level,
			);
		}

		if (targetChannels.length === 0) {
			toast("no changes");
			return;
		}

		if (targetChannels.length > 10) {
			setChannelCount(targetChannels.length);
			setLevel(level);
			setOnConfirm(() => () => {
				const reqId = setPending(targetChannels, level);
				toastHandler(
					enroll({
						level,
						channels: targetChannels,
					}).then(() => clearPending(reqId)),
					targetChannels.length,
				);
				close();
			});
			open();
			return;
		}

		// todo: toast
		const reqId = setPending(targetChannels, level);
		return toastHandler(
			enroll({
				level,
				channels: targetChannels,
			}).then(() => clearPending(reqId)),
			targetChannels.length,
		);
	};

	const { Modal, open, close } = useModal();
	const [onConfirm, setOnConfirm] = createSignal(() => {});
	const [channelCount, setChannelCount] = createSignal(0);
	const [level, setLevel] = createSignal<ChannelSubscribeLevel>(0);

	const _pendingLevel = createMemo(() => pendingLevel(props.node.channel.id));
	const displayLevel = createMemo(
		() => _pendingLevel() ?? subscriptions()?.[props.node.channel.id] ?? 0,
	);
	const isPending = createMemo(() => _pendingLevel() !== undefined);

	return (
		<>
			<Menu
				type="context"
				node={props.node}
				pending={isPending()}
				level={displayLevel()}
				handleAction={handleAction}
			>
				<div class="w-full h-full overflow-hidden flex gap-2 text-slate-950 items-center">
					<div class="font-bold">
						<Show when={isMobile()} fallback={props.node.fullName}>
							{props.node.channel.name}
						</Show>
					</div>
					<Show when={subscriptions()}>
						<BellButton
							pending={isPending()}
							level={displayLevel()}
							node={props.node}
							handleAction={handleAction}
						/>
					</Show>
					<Menu
						type="dropdown"
						node={props.node}
						pending={isPending()}
						level={displayLevel()}
						handleAction={handleAction}
					>
						<div class="w-6 h-6 color-gray-600 i-material-symbols:more-horiz" />
					</Menu>
					<span class="text-sm text-slate-600 truncate">
						{props.node.channel.topic}
					</span>
				</div>
			</Menu>
			<Modal title="通知の設定">
				<p class="mb-4">
					{channelCount()}個のチャンネルの通知を "
					{level() === 0
						? "無し"
						: level() === 1
						  ? "未読管理"
						  : "未読管理+通知"}
					" に設定します
				</p>
				<div class="flex justify-end gap-4">
					<button
						class="text-lg font-bold appearance-none inline-flex content-center items-center h-10 w-auto outline-none rounded-2 px-4 bg-gray-500 text-white enabled:hover:bg-gray-600"
						type="button"
						onClick={close}
					>
						キャンセル
					</button>
					<button
						class="text-lg font-bold appearance-none inline-flex content-center items-center h-10 w-auto outline-none rounded-2 px-4 bg-sky-500 text-white enabled:hover:bg-sky-600"
						type="button"
						onClick={onConfirm()}
					>
						通知設定を変更する
					</button>
				</div>
			</Modal>
		</>
	);
};

export default ChannelLi;
