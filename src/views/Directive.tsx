import { getGithubLinkFromPath } from "../lib/src";
import { useDocs } from "../lib/docs";

export default function Directive(props: { name: string }) {
	const docs = useDocs();

	if (!docs?.Directives[props.name]) {
		return "Directive not found";
	}

	const directive = docs.Directives[props.name];

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-8 flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button className="text-2xl font-bold px-2 py-1 rounded-md bg-zinc-900 w-fit flex flex-row justify-start font-mono">
					{`--@${directive.name}`}
				</button>

				<a className="text-2xl font-bold" href={getGithubLinkFromPath(directive.path)}>
					[src]
				</a>
			</div>

			<pre className="text-wrap">
				{directive.description}
			</pre>
		</div>
	)
}