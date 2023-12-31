import { Image } from "@kobalte/core";
import { Component, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { darkMode } from "~/contexts/darkMode";
import { isMobile } from "~/contexts/isMobile";
import useModal from "~/lib/useModal";
import { routeData } from "~/routes";

const Header: Component = () => {
	const { me } = useRouteData<typeof routeData>();
	const { Modal, open } = useModal();
	const { toggleIsDark } = darkMode;

	return (
		<>
			<div class="w-full max-w-1000px flex items-center flex-wrap">
				<div class="flex flex-wrap items-baseline gap-2">
					<h1 class="m-0">Q Bell</h1>
					<Show when={!isMobile()}>
						<p class="m-0">traQの通知編集アプリ</p>
					</Show>
				</div>
				<div class="flex items-center gap-4 ml-auto">
					<Show when={me()}>
						<Image.Root
							fallbackDelay={600}
							class="w-8 h-8 inline-flex items-center justify-center rounded-full overflow-hidden select-none"
							title={`Logged in as ${me()!.name}`}
						>
							<Image.Img
								src={`${import.meta.env.VITE_API_BASE_URL}/public/icon/${
									me()!.name
								}`}
								alt={`${me()!.name} icon`}
							/>
							<Image.Fallback class="w-full h-full flex align-middle items-center justify-center bg-slate-800 dark:bg-white prose-white text-xl font-bold">
								{me()!.name.charAt(0)}
							</Image.Fallback>
						</Image.Root>
					</Show>
					<button
						type="button"
						onClick={open}
						class="w-8 h-8 appearance-none i-material-symbols:help-outline"
					/>
					<button
						type="button"
						onClick={toggleIsDark}
						class="w-8 h-8 appearance-none i-material-symbols:light-mode-outline-rounded dark:(w-8 h-8 i-material-symbols:dark-mode-outline-rounded)"
					/>
					<a
						href="https://github.com/eyemono-moe/traQ-Pruning"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div class="w-8 h-8 i-logos:github-icon?mask" />
					</a>
				</div>
			</div>
			<Modal title="使い方">
				<p>traQの通知を編集するためのアプリです。</p>
				<ul>
					<li>チャンネル名横のハッシュ記号クリックで子階層を開閉します</li>
					<li>
						<span class="inline-block w-6 h-6 vertical-mid i-material-symbols:notifications-rounded" />
						ベルのアイコン クリックで通知設定を
						"通知なし"→"未読管理"→"未読管理+通知"→...の順に切り替えます
					</li>
					<li>
						<span class="inline-block w-6 h-6 vertical-mid i-material-symbols:more-horiz" />
						メニューアイコンクリック/右クリックでメニューを開きます
						<ul class="m-0">
							<li>
								子階層と一括：選択したチャンネルと、その子階層のチャンネルの通知設定を一括で変更します。孫階層以下は変更されません。
							</li>
							<li>
								子孫と一括：選択したチャンネルと、その子孫階層のチャンネルの通知設定を一括で変更します。孫階層以下も変更されます。
							</li>
						</ul>
					</li>
				</ul>
			</Modal>
		</>
	);
};

export default Header;
