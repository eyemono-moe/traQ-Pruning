import {
	StartServer,
	createHandler,
	renderAsync,
} from "solid-start/entry-server";
import { checkLoginMiddleware } from "./lib/checkLogin";

export default createHandler(
	checkLoginMiddleware,
	renderAsync((event) => <StartServer event={event} />),
);
