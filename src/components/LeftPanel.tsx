import { useEffect, useRef, useState } from "react";
import Logo from "../../assets/logo-round.svg";
import { IoSearch, IoStar } from "react-icons/io5";
import Tree, { type Item } from "./Tree";

import { getSFDocs, useDocs, type SFDocs } from "../lib/docs";
import RealmView from "./RealmView";

export default function LeftPanel(props: { className?: string }) {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [search, setSearch] = useState<string>("");
	const [items, setItems] = useState<Item[]>([]);
	const docs = useDocs();

	useEffect(() => {
		const callback = () => {
			searchInputRef.current?.focus();
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

		const librariesSection: Item = {
			title: <span>Libraries</span>,
			key: "libraries",
			children: [],
		};
		for (const [libName, lib] of Object.entries(docs?.Libraries ?? {})) {
			let foundValidChild = false;

			const children: Item[] = [];
			for (const [methodName, method] of Object.entries(lib.methods)) {
				if (!filter(`${libName}.${methodName}`)) continue;
				foundValidChild = true;

				children.push({
					title: (
						<span className="flex flex-row gap-1 items-center">
							<RealmView realm={method.realm} /> {methodName}
						</span>
					),
					key: `libraries.${libName}.${methodName}`,
					callback() {
						window.location.hash = `libraries.${libName}.${methodName}`;
					},
				});
			}

			if (!foundValidChild) continue;

			librariesSection.children.push({
				title: (
					<span className="flex flex-row gap-1 items-center">
						<RealmView realm={lib.realm} />
						{libName}
					</span>
				),
				key: `libraries.${libName}`,
				children,
			});
		}

		items.push(librariesSection);

		const typesSection: Item = {
			title: <span>Types</span>,
			key: "types",
			children: [],
		};
		for (const [typeName, type] of Object.entries(docs?.Types ?? {})) {
			let foundValidChild = false;

			const children = [];
			for (const [methodName, method] of Object.entries(type.methods)) {
				if (!filter(`${typeName}:${methodName}`)) continue;
				foundValidChild = true;

				children.push({
					title: (
						<span className="flex flex-row gap-1 items-center">
							<RealmView realm={method.realm} /> {methodName}
						</span>
					),
					key: `types.${typeName}.${methodName}`,
					callback() {
						window.location.hash = `types.${typeName}.${methodName}`;
					},
				});
			}

			if (!foundValidChild) continue;

			typesSection.children.push({
				title: (
					<span className="flex flex-row gap-1 items-center">
						<RealmView realm={type.realm} />
						{typeName}
					</span>
				),
				key: `types.${typeName}`,
				children,
			});
		}
		items.push(typesSection);

		const hooksSection: Item = {
			title: <span>Hooks</span>,
			key: "hooks",
			children: [],
		};
		for (const [hookName, hook] of Object.entries(docs?.Hooks ?? {})) {
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
		items.push(hooksSection);

		const directivesSection: Item = {
			title: <span>Directives</span>,
			key: "directives",
			children: [],
		};
		for (const [directiveName, _] of Object.entries(docs?.Directives ?? {})) {
			if (!filter(directiveName)) continue;

			directivesSection.children.push({
				title: <span>{`@${directiveName}`}</span>,
				key: `directives.${directiveName}`,
				callback() {
					window.location.hash = `directives.${directiveName}`;
				},
			});
		}
		items.push(directivesSection);

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
		items.push(contributorsSection);

		setItems(items);
	}, [docs, search]);

	return (
		<div
			className={`bg-zinc-800 text-white flex flex-col gap-2 p-1 lg:px-4 lg:py-2 h-full ${props.className ?? ""}`}
		>
			<a
				className="flex flex-row items-center gap-2 hover:cursor-pointer"
				href="."
			>
				<img alt="Neostarfall Logo" src={Logo} className="size-8 lg:size-16" />

				<span className="text-xl md:text-2xl lg:text-4xl overflow-hidden">
					Neostarfall
				</span>
			</a>

			<div className="flex flex-col gap-2">
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
						className="outline-none"
						placeholder="Search"
						ref={searchInputRef}
						onChange={(e) => setSearch(e.currentTarget.value)}
					/>
				</div>

				<Tree items={items} expandAll={search !== ""} />
			</div>
		</div>
	);
}
