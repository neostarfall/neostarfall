import { useContributors } from "../lib/contributors";

export default function Contributors() {
	const contributors = useContributors();

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-2 lg:p-8 flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button
					type="button"
					className="text-lg lg:text-2xl font-bold px-2 py-1 rounded-md bg-zinc-900 w-fit flex flex-row justify-start font-mono"
				>
					Contributions
				</button>
			</div>

			<ol className="overflow-y-scroll text-xs lg:text-base flex flex-col gap-1">
				{contributors.map((c) => (
					<div key={c.name} className="flex flex-row items-center">
						<a href={c.link} className="mr-2">
							<img src={c.avatar} className="rounded-lg w-8 h-8" alt={c.name} />
						</a>

						<span className="font-bold mr-1">{c.name}</span>

						<span className="inline md:hidden">{c.contributions}</span>
						<span className="hidden md:inline">
							has {c.contributions} contributions
						</span>
					</div>
				))}
			</ol>
		</div>
	);
}
