import { ItemBuilder } from "@/components/LeftPanel";
import { Item } from "@/components/Tree";
import { useExamples } from "@/lib/examples";
import { useEffect, useState } from "react";

import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export const getExampleItem: ItemBuilder = (docs, examples, filter) => {
	const examplesSection: Item = {
		title: <span>Examples</span>,
		key: "examples",
		children: [],
	};

	for (const example of examples) {
		if (!filter(example.fileName)) continue;

		examplesSection.children.push({
			title: (
				<span className="flex flex-row gap-1 items-center">
					{example.fileName}
				</span>
			),
			key: `examples.${example.fileName}`,
			callback() {
				window.location.hash = `examples.${example.fileName}`;
			},
		});
	}

	return examplesSection;
}

const HighlightedCode = (code: string) => {
	return hljs.highlight(code, { language: "lua" }).value;
}

export default function Example(props: { name: string }) {
	const examples = useExamples();
	const exampleURL = examples.find((example) => example.fileName === props.name)?.rawUrl;

	let [exampleContent, setExampleContent] = useState<string | undefined>(undefined);

	useEffect(() => {
		const fetchExample = async () => {
			if (!exampleURL) return;

			const response = await fetch(exampleURL);
			if (!response.ok) {
				console.error("Failed to fetch example:", response.statusText);
				return;
			}

			const text = await response.text();
			setExampleContent(text);
		};

		fetchExample();
	}, [examples, props.name]);

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-2 md:p-8 flex flex-col gap-2 overflow-y-auto">
			<h3>
				<a
					href={exampleURL ?? ""}
					className="text-gray-400 hover:text-white"
					target="_blank"
					rel="noopener noreferrer"
				>
					{props.name}
				</a>
			</h3>

			{(() => {
				if (!exampleContent) {
					return <div className="text-gray-400">Loading...</div>;
				}

				return (
					<pre className="bg-zinc-900 p-8 rounded-md overflow-x-auto">
						<code
							dangerouslySetInnerHTML={{
								__html: HighlightedCode(exampleContent)
							}}
						/>
					</pre>
				);
			})()}
		</div>
	)
}