import { getGithubLinkFromPath } from "../lib/src";
import { useDocs } from "../lib/docs";
import RealmView from "../components/RealmView";
import { InlineMethod } from "./Method";
import { formatDescription } from "../lib/format";

export default function Type(props: { name: string }) {
	const docs = useDocs();

	if (!docs?.Types[props.name]) {
		return <div className="bg-zinc-800 w-full h-full">Loading...</div>;
	}

	const type = docs.Types[props.name];

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-8 flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button
					type="button"
					className="text-2xl font-bold px-2 py-1 rounded-md bg-zinc-900 w-fit flex flex-row gap-2 items-center font-mono"
				>
					<RealmView realm={type.realm} className="size-6" />
					{type.name}
				</button>

				<a
					className="text-2xl font-bold"
					href={getGithubLinkFromPath(type.path)}
				>
					[src]
				</a>
			</div>

			<pre className="text-wrap">{formatDescription(type.description)}</pre>

			<ol className="flex flex-col gap-8 overflow-y-auto">
				{Object.entries(type.methods).map(([_, method], i) => (
					<div key={method.name} className="flex flex-col gap-8">
						<InlineMethod name={method.name} type={type.name} />
						{i !== Object.entries(type.methods).length - 1 && <hr />}
					</div>
				))}
			</ol>
		</div>
	);
}
