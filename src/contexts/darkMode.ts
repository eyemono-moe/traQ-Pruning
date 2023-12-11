import {
	Accessor,
	Setter,
	createEffect,
	createRoot,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";
import { createLocalSignal } from "~/lib/createLocalSignal";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const createDarkModeContext = () => {
	const [_, setIsDark] = createSignal<Accessor<boolean>>();
	const [isDarkSetter, setIsDarkSetter] = createSignal<Setter<boolean>>(
		() => {},
	);

	onMount(() => {
		console.log("onMount");
		const [localIsDark, setLocalIsDark] = createLocalSignal(
			"color-schema",
			window.matchMedia(COLOR_SCHEME_QUERY).matches,
		);
		setIsDark(() => localIsDark);
		setIsDarkSetter(() => setLocalIsDark);

		const onChange = () => {
			console.log("onChange");
			setLocalIsDark(window.matchMedia(COLOR_SCHEME_QUERY).matches);
		};

		window.matchMedia(COLOR_SCHEME_QUERY).addEventListener("change", onChange);
		onChange(); // 最初の一回を明示的に実行

		onCleanup(() => {
			window
				.matchMedia(COLOR_SCHEME_QUERY)
				.removeEventListener("change", onChange);
		});

		createEffect(() => {
			console.log("createEffect");
			document.documentElement.classList.toggle("dark", localIsDark());
		});
	});

	const toggleIsDark = () => isDarkSetter()((prev) => !prev);

	return { toggleIsDark };
};

export const darkMode = createRoot(createDarkModeContext);
