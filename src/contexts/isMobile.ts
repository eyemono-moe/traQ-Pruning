import {
	createEffect,
	createRoot,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";

const VIEWPORT_SIZE_QUERY = "screen and (max-width: 640px)";

const createMobileContext = () => {
	const [isMobile, setIsMobile] = createSignal(false);

	const onChange = () =>
		setIsMobile(window.matchMedia(VIEWPORT_SIZE_QUERY).matches);

	onMount(() => {
		window.matchMedia(VIEWPORT_SIZE_QUERY).addEventListener("change", onChange);
		onChange(); // 最初の一回を明示的に実行
	});

	onCleanup(() => {
		window
			.matchMedia(VIEWPORT_SIZE_QUERY)
			.removeEventListener("change", onChange);
	});

	return isMobile;
};

export const isMobile = createRoot(createMobileContext);
