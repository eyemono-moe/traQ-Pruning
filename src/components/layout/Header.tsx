import { Image } from "@kobalte/core";
import { Component, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { routeData } from "~/routes";

const Header: Component = () => {
	const { me } = useRouteData<typeof routeData>();

	return (
		<div class="w-full max-w-1000px flex items-center flex-wrap">
			<div class="flex items-baseline gap-2">
				<h1>Q Bell</h1>
				<p class="text-slate-600">traQの通知編集アプリ</p>
			</div>
			<Show when={me()}>
				<div class="flex items-center gap-2 ml-auto text-slate-600">
					{/* TODO: add help button */}
					<Image.Root
						fallbackDelay={600}
						class="inline-flex items-center justify-center align-middle w-8 h-8 rounded-full overflow-hidden select-none"
					>
						<Image.Img
							src={`https://q.trap.jp/api/v3/public/icon/${me()!.name}`}
							alt={`${me()!.name} icon`}
						/>
						<Image.Fallback class="w-full h-full flex items-center justify-center bg-sky-500 text-white text-xl font-bold">
							{me()!.name.charAt(0)}
						</Image.Fallback>
					</Image.Root>
				</div>
			</Show>
		</div>
	);
};

export default Header;
