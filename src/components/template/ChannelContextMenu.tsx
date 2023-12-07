import { ContextMenu } from "@kobalte/core";
import { ParentComponent } from "solid-js";

const container =
	"p-2 bg-white rounded border-1 border-slate-400 shadow outline-none";

const item =
	"text-lg h-8 leading-none rounded flex items-center h-4 pr-2 pl-6 py-0 position-relative select-none outline-none data-[highlighted]:(outline-none bg-sky-600 text-white)";

const ChannelContextMenu: ParentComponent = (props) => {
	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger class="w-full h-full">
				{props.children}
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Content class={container}>
					<ContextMenu.Group>
						<ContextMenu.GroupLabel class="context-menu__group-label">
							通知設定
						</ContextMenu.GroupLabel>
						<ContextMenu.RadioGroup value={"none"} onChange={() => {}}>
							<ContextMenu.RadioItem class={item} value="none">
								<ContextMenu.ItemIndicator></ContextMenu.ItemIndicator>
								なし
							</ContextMenu.RadioItem>
							<ContextMenu.RadioItem class={item} value="notify">
								<ContextMenu.ItemIndicator></ContextMenu.ItemIndicator>
								未読のみ管理
							</ContextMenu.RadioItem>
							<ContextMenu.RadioItem class={item} value="subscribe">
								<ContextMenu.ItemIndicator></ContextMenu.ItemIndicator>
								通知オン
							</ContextMenu.RadioItem>
						</ContextMenu.RadioGroup>
					</ContextMenu.Group>
					<ContextMenu.Separator />
					<ContextMenu.Sub overlap gutter={4} shift={-8}>
						<ContextMenu.SubTrigger class={item}>
							子階層の通知一括設定
						</ContextMenu.SubTrigger>
						<ContextMenu.Portal>
							<ContextMenu.SubContent class={container}>
								<ContextMenu.Item class={item}>なし</ContextMenu.Item>
								<ContextMenu.Item class={item}>未読のみ管理</ContextMenu.Item>
								<ContextMenu.Item class={item}>通知オン</ContextMenu.Item>
							</ContextMenu.SubContent>
						</ContextMenu.Portal>
					</ContextMenu.Sub>
					<ContextMenu.Sub overlap gutter={4} shift={-8}>
						<ContextMenu.SubTrigger class={item}>
							子孫階層全ての通知一括設定
						</ContextMenu.SubTrigger>
						<ContextMenu.Portal>
							<ContextMenu.SubContent class={container}>
								<ContextMenu.Item class={item}>なし</ContextMenu.Item>
								<ContextMenu.Item class={item}>未読のみ管理</ContextMenu.Item>
								<ContextMenu.Item class={item}>通知オン</ContextMenu.Item>
							</ContextMenu.SubContent>
						</ContextMenu.Portal>
					</ContextMenu.Sub>
					<ContextMenu.Separator />
					<ContextMenu.Item class={item}>traQで開く</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	);
};

export default ChannelContextMenu;
