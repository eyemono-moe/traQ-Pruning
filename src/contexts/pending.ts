import { ChannelSubscribeLevel } from "@traptitech/traq";
import { createMemo, createRoot } from "solid-js";
import { createStore } from "solid-js/store";

const createPendingContext = () => {
	const [pendingMap, setPendingMap] = createStore<{
		currentIndex: number;
		pending: {
			[requestId: number]:
				| {
						[channelId: string]: ChannelSubscribeLevel;
				  }
				| undefined;
		};
	}>({
		currentIndex: 0,
		pending: {},
	});

	const flattenPendingMap = createMemo(() => {
		return Object.entries(pendingMap.pending)
			.sort((a, b) => (a[0] > b[0] ? 1 : -1))
			.reduce<{
				[channelId: string]: ChannelSubscribeLevel;
			}>((acc, [_, channelId]) => {
				if (channelId === undefined) return acc;
				for (const [id, level] of Object.entries(channelId)) {
					acc[id] = level;
				}
				return acc;
			}, {});
	});

	const pendingLevel = (
		channelId: string,
	): ChannelSubscribeLevel | undefined => {
		return flattenPendingMap()[channelId];
	};

	const clearPending = (id: number) => {
		setPendingMap("pending", id, undefined);
	};

	const setPending = (channelId: string[], level: ChannelSubscribeLevel) => {
		const currentIndex = pendingMap.currentIndex;
		setPendingMap("pending", currentIndex, {
			...pendingMap.pending[currentIndex],
			...Object.fromEntries(channelId.map((id) => [id, level])),
		});
		setPendingMap("currentIndex", currentIndex + 1);
		return currentIndex;
	};

	return {
		pendingMap,
		clearPending,
		setPending,
		pendingLevel,
	};
};

export const usePending = createRoot(createPendingContext);
