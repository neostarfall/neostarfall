import { getGithubLinkFromPath } from "../lib/src";
import ParamsView from "../components/ParamsView";
import { useDocs } from "../lib/docs";
import TypeView from "../components/TypeView";
import RealmView from "../components/RealmView";
import { formatDescription } from "../lib/format";
import { ItemBuilder } from "@/components/LeftPanel";
import { Item } from "@/components/Tree";

export const getHookItem: ItemBuilder = (docs, examples, filter) => {
	const hooksSection: Item = {
		title: <span>Hooks</span>,
		key: "hooks",
		children: [],
	};

	for (const [hookName, hook] of Object.entries(docs.Hooks ?? {})) {
		if (!filter(hookName)) continue;

		hooksSection.children.push({
			title: (
				<span className="flex flex-row gap-1 items-center">
					<RealmView realm={hook.realm} /> {hookName}
				</span>
			),
			key: `hooks.${hookName}`,
			callback() {
				window.location.hash = `hooks.${hookName}`;
			},
		});
	}

	return hooksSection;
}


export default function Hook(props: { name: string }) {
	const docs = useDocs();

	if (!docs?.Hooks[props.name]) {
		return <div className="bg-zinc-800 w-full h-full">Loading...</div>;
	}

	const hook = docs.Hooks[props.name];

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-2 md:p-8 flex flex-col gap-2 overflow-y-auto">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button
					type="button"
					className="text-2xl font-bold px-2 py-1 rounded-md outline-none bg-zinc-900 w-fit flex flex-row justify-start font-mono"
				>
					<RealmView realm={hook.realm} className="mr-2 size-6" />

					{hook.name}

					<ParamsView params={hook.params} className="hidden md:flex" />
				</button>

				<a
					className="text-2xl font-bold"
					href={getGithubLinkFromPath(hook.path)}
				>
					[src]
				</a>
			</div>

			<pre className="text-wrap px-2">
				{formatDescription(hook.description)}
			</pre>

			{(() => {
				if (hook.params) {
					return (
						<div className="flex flex-col gap-4 px-2">
							<span className="text-lg font-bold">Parameters</span>

							<div className="flex flex-col gap-6">
								{hook.params.map((param, i) => (
									<div
										key={`${param.name}-${param.type}`}
										className="flex flex-col gap-1"
									>
										<div className="flex flex-row gap-1">
											<TypeView name={param.type} />
											{param.name}
										</div>

										<div className="rounded-md">{param.description}</div>
									</div>
								))}
							</div>
						</div>
					);
				}
			})()}
		</div>
	);
}
