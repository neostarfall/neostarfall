import { getGithubLinkFromPath } from "../lib/src";
import { useDocs } from "../lib/docs";
import RealmView from "../components/RealmView";
import { InlineMethod } from "./Method";
import { formatDescription } from "../lib/format";
import type { ItemBuilder } from "@/components/LeftPanel";
import type { Item } from "@/components/Tree";

export const getClassItem: ItemBuilder = (docs, examples, filter) => {
	const classesSection: Item = {
		title: <span>Classes</span>,
		key: "classes",
		children: [],
	};

	for (const [className, classData] of Object.entries(docs?.Types ?? {})) {
		let foundValidChild = false;

		const children = [];
		for (const [methodName, method] of Object.entries(classData.methods)) {
			if (!filter(`${className}:${methodName}`)) continue;
			foundValidChild = true;

			children.push({
				title: (
					<span className="flex flex-row gap-1 items-center">
						<RealmView realm={method.realm} /> {methodName}
					</span>
				),
				key: `classes.${className}.${methodName}`,
				callback() {
					window.location.hash = `classes.${className}.${methodName}`;
				},
			});
		}

		if (!foundValidChild) continue;

		classesSection.children.push({
			title: (
				<span className="flex flex-row gap-1 items-center">
					<RealmView realm={classData.realm} />
					{className}
				</span>
			),
			key: `classes.${className}`,
			children,
		});
	}

	return classesSection;
};

export default function Class(props: { name: string }) {
	const docs = useDocs();

	if (!docs?.Types[props.name]) {
		return <div className="bg-zinc-800 w-full h-full">Loading...</div>;
	}

	const classData = docs.Types[props.name];

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-8 flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button
					type="button"
					className="text-2xl font-bold px-2 py-1 rounded-md bg-zinc-900 w-fit flex flex-row gap-2 items-center font-mono"
				>
					<RealmView realm={classData.realm} className="size-6" />
					{classData.name}
				</button>

				<a
					className="text-2xl font-bold"
					href={getGithubLinkFromPath(classData.path)}
				>
					[src]
				</a>
			</div>

			<pre className="text-wrap">
				{formatDescription(classData.description)}
			</pre>

			<ol className="flex flex-col gap-8 overflow-y-auto">
				{Object.entries(classData.methods).map(([_, method], i) => (
					<div key={method.name} className="flex flex-col gap-8">
						<InlineMethod name={method.name} type={classData.name} />
						{i !== Object.entries(classData.methods).length - 1 && <hr />}
					</div>
				))}
			</ol>
		</div>
	);
}
