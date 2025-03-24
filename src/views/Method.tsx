import ParamsView from "../components/ParamsView";
import TypeView from "../components/TypeView";
import { type SFDocMethodEntry, useDocs } from "../lib/docs";
import { getGithubLinkFromPath } from "../lib/src";

export function InlineMethod(props: {
	lib?: string;
	type?: string;
	name: string;
}) {
	const docs = useDocs();

	if (!props.lib && !props.type) {
		return "What";
	}

	let method: SFDocMethodEntry | undefined;
	let separator = ".";
	if (props.lib) {
		method = docs?.Libraries[props.lib].methods[props.name];
	} else if (props.type) {
		method = docs?.Types[props.type].methods[props.name];
		separator = ":";
	}

	if (!method) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button
					type="button"
					className="text-lg lg:text-2xl font-bold px-2 py-1 rounded-md outline-none bg-zinc-900 w-fit flex flex-row justify-start font-mono"
				>
					{(() => {
						if (props.lib !== "builtins") {
							return (
								<>
									<button
										type="button"
										className="text-blue-400 hover:cursor-pointer"
										onClick={() => {
											window.location.hash = props.lib
												? `libraries.${props.lib}`
												: `types.${props.type}`;
										}}
									>
										{props.lib ?? props.type}
									</button>

									{separator}
								</>
							);
						}
					})()}

					{method.name}

					<ParamsView params={method.params} className="hidden md:flex" />
				</button>

				<a
					className="text-2xl font-bold"
					href={getGithubLinkFromPath(method.path)}
				>
					[src]
				</a>
			</div>

			<pre className="text-wrap lg:px-2">
				{method.description.trim().replaceAll("\n ", "\n")}
			</pre>

			{(() => {
				if (method.params) {
					return (
						<div className="flex flex-col gap-4 px-2">
							<span className="text-lg font-bold">Parameters</span>

							<div className="flex flex-col gap-6">
								{method.params.map((param, i) => (
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

			{(() => {
				if (method.returns) {
					return (
						<div className="flex flex-col gap-4 px-2">
							<span className="text-lg font-bold">Returns</span>

							<div className="flex flex-col gap-6">
								{method.returns.map((ret, i) => (
									<div
										key={`${ret.name}-${ret.type}`}
										className="flex flex-col gap-1"
									>
										<div className="flex flex-row gap-1">
											<TypeView name={ret.type} />
											{ret.name}
										</div>

										<div className="rounded-md">{ret.description}</div>
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

export default function Method(props: {
	lib?: string;
	type?: string;
	name: string;
}) {
	return (
		<div className="bg-zinc-800 w-full h-full text-white p-1 lg:p-8 flex flex-col gap-2">
			<InlineMethod lib={props.lib} type={props.type} name={props.name} />
		</div>
	);
}
