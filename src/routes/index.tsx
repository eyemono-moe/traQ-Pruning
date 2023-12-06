import { createEffect } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import useApi from "~/lib/useApi";

export const routeData = () => {
	const me = createServerData$(async (_, event) => {
		console.log("routeData me");
		const api = await useApi(event.request);
		const { data: me } = await api.getMe();
		return me;
	});

	return { me };
};

export default function Page() {
	console.log("Page");
	const { me } = useRouteData<typeof routeData>();

	createEffect(() => {
		console.log(me());
	});

	return (
		<main>
			<h1>Hello world!</h1>
			<div>{me()?.displayName}</div>
		</main>
	);
}
