import { useEffect, useRef, useState } from "react";
import { IoLogoGithub, IoSearch } from "react-icons/io5";
import Tree, { type Item } from "./Tree";

import { type SFDocs, useDocs } from "../lib/docs";
import { FaDiscord } from "react-icons/fa";
import { getGlobalsItem, getLibraryItem } from "@/views/Library";
import { getClassItem } from "@/views/Class";
import { getHookItem } from "@/views/Hook";
import { getDirectiveItem } from "@/views/Directive";
import { getContributorsItem } from "@/views/Contributors";
import { type Example, useExamples } from "@/lib/examples";
import { getExampleItem } from "@/views/Example";

export type ItemBuilder = (
	docs: SFDocs,
	examples: Example[],
	filter: (name: string) => boolean,
) => Item;

function recursiveSort(item: Item) {
	if ("children" in item) {
		item.children.sort((a, b) => a.key.localeCompare(b.key));
		item.children.forEach(recursiveSort);
	}
}

export default function LeftPanel(props: { className?: string }) {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [search, setSearch] = useState<string>("");
	const [items, setItems] = useState<Item[]>([]);
	const docs = useDocs();
	const examples = useExamples();

	useEffect(() => {
		const callback = () => {
			// Check if there is no text selected before focusing
			if (!window.getSelection()?.toString()) {
				searchInputRef.current?.focus();
			}
		};

		window.addEventListener("keydown", callback);
		return () => {
			window.removeEventListener("keydown", callback);
		};
	});

	useEffect(() => {
		if (!docs) {
			setItems([]);
			return;
		}

		const items: Item[] = [];

		const lowerSearch = search.toLowerCase();

		const filter = (name: string) => {
			if (search === "") return true;
			return name.toLowerCase().includes(lowerSearch);
		};

		items.push(getGlobalsItem(docs, examples, filter));
		items.push(getLibraryItem(docs, examples, filter));
		items.push(getClassItem(docs, examples, filter));
		items.push(getHookItem(docs, examples, filter));
		items.push(getDirectiveItem(docs, examples, filter));
		items.push(getExampleItem(docs, examples, filter));
		items.push(getContributorsItem(docs, examples, filter));

		items.forEach(recursiveSort);

		setItems(items);
	}, [docs, examples, search]);

	return (
		<div
			className={`bg-zinc-800 text-white flex flex-col h-full ${props.className ?? ""}`}
		>
			<div className="h-full max-h-11/12 p-1 lg:px-4 lg:py-2 flex flex-col gap-2 overflow-clip">
				<a
					className="flex flex-row items-center gap-2 hover:cursor-pointer"
					href="."
				>
					<img
						alt="Neostarfall Logo"
						src="https://raw.githubusercontent.com/neostarfall/neostarfall/refs/heads/master/branding/neostarfall-round.svg"
						className="size-8 lg:size-16"
					/>

					<span className="text-lg md:text-xl lg:text-4xl overflow-hidden">
						Neostarfall
					</span>
				</a>

				<div className="flex flex-col gap-2 h-full">
					<div
						className="flex flex-row gap-2 py-2 lg:py-1 text-sm lg:text-base items-center border-b border-white"
						onClick={() => searchInputRef.current?.focus()}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								searchInputRef.current?.focus();
							}
						}}
					>
						<IoSearch className="hidden lg:block" />
						<input
							className="outline-none bg-transparent"
							placeholder="Search"
							ref={searchInputRef}
							onChange={(e) => setSearch(e.currentTarget.value)}
						/>
					</div>

					<Tree items={items} expand={search !== ""} />
				</div>
			</div>

			<div className="border-t border-white flex flex-row text-2xl md:text-3xl justify-center min-h-16">
				<div className="w-1/2 flex flex-row gap-2 justify-evenly items-center">
					<a
						href="https://github.com/neostarfall/neostarfall"
						className="hover:text-white/70 transition duration-100"
					>
						<IoLogoGithub />
					</a>

					<a
						href="https://discord.gg/aSXXa4urpm"
						className="hover:text-white/70 transition duration-100"
					>
						<FaDiscord />
					</a>
				</div>
			</div>
		</div>
	);
}
