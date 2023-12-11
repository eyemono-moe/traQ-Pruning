import { Dialog, createDisclosureState } from "@kobalte/core";
import { ParentComponent } from "solid-js";

const useModal = () => {
	const { isOpen, open, close } = createDisclosureState();

	const Modal: ParentComponent<{
		title: string;
	}> = (props) => {
		return (
			<Dialog.Root open={isOpen()}>
				<Dialog.Portal>
					<Dialog.Overlay class="position-fixed inset-0 bg-black bg-opacity-50 data-[expanded]:(animate-fade-in animate-duration-150) animate-fade-out animate-duration-150" />
					<div class="position-fixed inset-0 flex items-center justify-center p-2">
						<Dialog.Content
							onEscapeKeyDown={close}
							onPointerDownOutside={close}
							class="p-4 max-w-full rounded shadow-lg bg-white dark:(shadow-dark-200 bg-dark-300) z-50 data-[expanded]:(animate-fade-in animate-duration-150) animate-fade-out animate-duration-150"
						>
							<div class="flex items-center justify-between mb-4">
								<Dialog.Title class="m-0 text-lg font-bold">
									{props.title}
								</Dialog.Title>
								<Dialog.CloseButton class="h-8 w-8" onClick={close}>
									<div class="h-8 w-8 i-material-symbols:close-rounded" />
								</Dialog.CloseButton>
							</div>
							<Dialog.Description class="m-0">
								{props.children}
							</Dialog.Description>
						</Dialog.Content>
					</div>
				</Dialog.Portal>
			</Dialog.Root>
		);
	};

	return {
		Modal,
		open,
		close,
		isOpen,
	};
};

export default useModal;
