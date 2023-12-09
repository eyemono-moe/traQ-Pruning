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
import { Toaster } from "solid-toast";
import "uno.css";

export default function Root() {
	return (
		<Html
			lang="ja"
			style={{
				"scrollbar-gutter": "stable",
			}}
			class="text-slate-800"
		>
			<Head>
				<Title>Q Bell - traQの通知管理アプリ</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />
				<Link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				{/* OGP */}
				<Meta name="description" content="Q Bell - traQの通知編集アプリ" />
				<Meta property="og:type" content="article" />
				<Meta property="og:title" content="Q Bell" />
				<Meta property="og:url" content="https://bell.trap.show" />
				<Meta property="og:image" content="https://bell.trap.show/ogp.png" />
				<Meta
					property="og:description"
					content="Q Bell - traQの通知編集アプリ"
				/>
				<Meta property="article:author" content="@eyemono.moe" />
				<Meta name="twitter:card" content="summary" />
				<Meta name="twitter:title" content="Q Bell" />
				<Meta
					name="twitter:description"
					content="Q Bell - traQの通知編集アプリ"
				/>
				<Meta name="twitter:image" content="https://bell.trap.show/ogp.png" />
			</Head>
			<Body class="text-base prose max-w-full">
				<Suspense>
					<ErrorBoundary>
						<Routes>
							<FileRoutes />
						</Routes>
						<Toaster position="bottom-right" />
					</ErrorBoundary>
				</Suspense>
				<Scripts />
			</Body>
		</Html>
	);
}
