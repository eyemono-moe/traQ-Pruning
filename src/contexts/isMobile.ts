import {
	createEffect,
	createRoot,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";

const VIEWPORT_SIZE_QUERY = "screen and (max-width: 640px)";

const createColorScheme = () => {
	const [isMobile, setIsMobile] = createSignal(
		window.matchMedia(VIEWPORT_SIZE_QUERY).matches,
	);

	const onChange = () =>
		setIsMobile(window.matchMedia(VIEWPORT_SIZE_QUERY).matches);

	createEffect(() => {
		console.log("isMobile", isMobile());
	});

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

export const isMobile = createRoot(createColorScheme);
