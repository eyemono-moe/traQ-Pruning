import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import useApi from "~/lib/useApi";

export const routeData = () => {
	const me = createServerData$(async (_, event) => {
		const api = await useApi(event.request);
		const { data: me } = await api.getMe();
		return me;
	});

	return { me };
};

export default function Page() {
	const { me } = useRouteData<typeof routeData>();

	return (
		<main>
			<h1>Hello world!</h1>
			<div>{me()?.displayName}</div>
		</main>
	);
}
