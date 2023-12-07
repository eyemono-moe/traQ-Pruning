import "@unocss/reset/tailwind.css";
// @refresh reload
import { Suspense } from "solid-js";
import {
	Body,
	ErrorBoundary,
	FileRoutes,
	Head,
	Html,
	Link,
	Meta,
	Routes,
	Scripts,
	Title,
} from "solid-start";
import "uno.css";

export default function Root() {
	return (
		<Html lang="ja">
			<Head>
				<Title>Q Bell - traQの通知管理アプリ</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />
				<Link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				{/* OGP */}
				<Meta property="og:type" content="article" />
				<Meta property="og:title" content="Q Bell" />
				<Meta property="og:url" content="https://bell.trap.show" />
				<Meta property="og:image" content="" />
				<Meta
					property="og:description"
					content="Q Bell - traQの通知編集アプリ"
				/>
				<Meta property="article:author" content="@eyemono.moe" />
			</Head>
			<Body class="h-100vh">
				<Suspense>
					<ErrorBoundary>
						<Routes>
							<FileRoutes />
						</Routes>
					</ErrorBoundary>
				</Suspense>
				<Scripts />
			</Body>
		</Html>
	);
}
