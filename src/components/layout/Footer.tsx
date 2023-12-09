import { Component } from "solid-js";

const Footer: Component = () => {
	return (
		<div class="w-full max-w-1000px flex gap-4 items-center justify-end">
			<a
				href="https://github.com/eyemono-moe/traQ-Pruning"
				target="_blank"
				rel="noopener noreferrer"
			>
				<div class="w-8 h-8 i-logos:github-icon" />
			</a>
		</div>
	);
};

export default Footer;
