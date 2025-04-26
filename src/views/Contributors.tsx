import { ItemBuilder } from "@/components/LeftPanel";
import { useContributors } from "../lib/contributors";
import { Item } from "@/components/Tree";
import { IoStar } from "react-icons/io5";

export const getContributorsItem: ItemBuilder = () => {
	const contributorsSection: Item = {
		title: (
			<div className="flex flex-row gap-1">
				<IoStar />
				Contributors
			</div>
		),
		key: "contributors",
		callback() {
			window.location.hash = "contributors";
		},
	};

	return contributorsSection;
}

export default function Contributors() {
	const contributors = useContributors();

	return (
		<div className="bg-zinc-800 w-full h-full text-white p-2 md:p-4 lg:p-8 flex flex-col gap-2">
			<div className="flex flex-row items-center justify-between px-2 py-2">
				<button
					type="button"
					className="text-lg lg:text-2xl font-bold px-2 py-1 rounded-md bg-zinc-900 w-fit flex flex-row justify-start font-mono"
				>
					Contributions
				</button>
			</div>

			<p>
				This is everybody who has contributed to the Starfall project, through
				GmodStarfall, INP Starfall, StarfallEx and finally to Neostarfall.
			</p>

			<ol className="overflow-y-scroll text-xs lg:text-base flex flex-col gap-1 p-2">
				{contributors.map((c) => (
					<div
						key={c.name}
						className={`flex flex-row items-center ${c.hidden ? "blur-sm hover:blur-none transition duration-200" : ""}`}
					>
						<a href={c.link} className="mr-2">
							<img src={c.avatar} className="rounded-lg w-8 h-8" alt={c.name} />
						</a>

						<span className="font-bold mr-1">
							{c.name.length > 20 ? `${c.name.slice(0, 15)}...` : c.name}
						</span>

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
