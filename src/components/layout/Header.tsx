import { Image } from "@kobalte/core";
import { Component, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { isMobile } from "~/contexts/isMobile";
import { routeData } from "~/routes";

const Header: Component = () => {
	const { me } = useRouteData<typeof routeData>();

	return (
		<div class="w-full max-w-1000px flex items-center flex-wrap">
			<div class="flex flex-wrap items-baseline gap-2">
				<h1 class="m-0">Q Bell</h1>
				<Show when={!isMobile()}>
					<p class="text-slate-600 m-0">traQの通知編集アプリ</p>
				</Show>
			</div>
			<div class="flex items-center gap-4 ml-auto text-slate-600">
				<a
					href="https://github.com/eyemono-moe/traQ-Pruning"
					target="_blank"
					rel="noopener noreferrer"
				>
					<div class="w-8 h-8 i-logos:github-icon" />
				</a>
				{/* TODO: add help button */}
				<Show when={me()}>
					<Image.Root
						fallbackDelay={600}
						class="w-8 h-8 inline-flex items-center justify-center align-middle rounded-full overflow-hidden select-none"
					>
						<Image.Img
							src={`https://q.trap.jp/api/v3/public/icon/${me()!.name}`}
							alt={`${me()!.name} icon`}
						/>
						<Image.Fallback class="w-full h-full flex items-center justify-center bg-slate-500 text-white text-xl font-bold">
							{me()!.name.charAt(0)}
						</Image.Fallback>
					</Image.Root>
				</Show>
			</div>
		</div>
	);
};

export default Header;
