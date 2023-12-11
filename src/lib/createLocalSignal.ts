import { Signal, createEffect, createSignal } from "solid-js";

export function createLocalSignal<T>(name: string, init: T): Signal<T> {
	const localState = localStorage.getItem(name);
	const [value, setValue] = createSignal<T>(
		localState ? JSON.parse(localState) : init,
	);
	createEffect(() => localStorage.setItem(name, JSON.stringify(value())));
	return [value, setValue];
}
