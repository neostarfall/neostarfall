import ParamsView from "../components/ParamsView";
import TypeView from "../components/TypeView";
import { SFDocMethodEntry, useDocs } from "../lib/docs";
import { getGithubLinkFromPath } from "../lib/src";

export default function Method(props: { lib?: string; type?: string; name: string }) {
	const docs = useDocs();

	if (!props.lib && !props.type) {
		return "What";
	}

	let method: SFDocMethodEntry | undefined;
	let separator;
	if (props.lib) {
		method = docs?.Libraries[props.lib].methods[props.name];
		separator = '.';
	} else if (props.type) {
		method = docs?.Types[props.type].methods[props.name];
		separator = ':'
	}

	if (!method) {
		return "Method not found";
	}

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-8 flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button className="text-2xl font-bold px-2 py-1 rounded-md outline-none bg-zinc-900 w-fit flex flex-row justify-start font-mono">
					<a className="text-blue-400" href={props.lib ? `libraries.${props.lib}` : `types.${props.type}`}>
						{props.lib ?? props.type}
					</a>

					{separator}

					{method.name}

					<ParamsView params={method.params} />
				</button>

				<a className="text-2xl font-bold" href={getGithubLinkFromPath(method.path)}>
					[src]
				</a>
			</div>

			<pre className="text-wrap px-2">
				{method.description}
			</pre>

			{(() => {
				if (method.params) {
					return (
						<div className="flex flex-col gap-4 px-2">
							<span className="text-lg font-bold">Parameters</span>

							<div className="flex flex-col gap-6">
								{method.params.map((param, i) => (
									<div className="flex flex-col gap-1">
										<div className="flex flex-row gap-1">
											<TypeView name={param.type}/>
											{param.name}
										</div>

										<div className="rounded-md">
											{param.description}
										</div>
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