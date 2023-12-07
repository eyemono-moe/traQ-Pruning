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
					<Dialog.Overlay />
					<div>
						<Dialog.Content
							onEscapeKeyDown={close}
							onPointerDownOutside={close}
						>
							<div>
								<Dialog.Title>{props.title}</Dialog.Title>
								<Dialog.CloseButton>
									<div />
								</Dialog.CloseButton>
							</div>
							<Dialog.Description>{props.children}</Dialog.Description>
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
