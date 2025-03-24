import { useEffect, useRef, useState } from "react";
import Logo from "../../assets/logo-round.svg";
import { IoSearch } from "react-icons/io5";
import Tree, { Item } from "./Tree";

import { getSFDocs, useDocs, type SFDocs } from "../lib/docs";
import RealmView from "./RealmView";

export default function LeftPanel(props: { className?: string }) {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [search, setSearch] = useState<string>("");
	const [items, setItems] = useState<Item[]>([]);
	const [openByDefault, setOpenByDefault] = useState(false);
	const docs = useDocs();

	useEffect(() => {
		if (!docs) {
			setItems([]);
			return;
		}

		const items: Item[] = [];

		const lowerSearch = search.toLowerCase();

		setOpenByDefault(search !== "");
		const filter = (name: string) => {
			if (search === "") return true;

			return name.toLowerCase().includes(lowerSearch);
		}

		const librariesSection: Item = { title: <span>Libraries</span>, children: [] };
		for (const [libName, lib] of Object.entries(docs?.Libraries ?? {})) {
			if (!filter(libName)) continue;

			const children: Item[] = []
			for (const [methodName, method] of Object.entries(lib.methods)) {
				if (!filter(`${libName}.${methodName}`)) continue;

				children.push({
					title: <span className="flex flex-row gap-1 items-center"><RealmView realm={method.realm as any} /> {methodName}</span>,
					callback() {
						window.location.hash = `libraries.${libName}.${methodName}`;
					}
				});
			}

			librariesSection.children.push({ title: <span className="flex flex-row gap-1 items-center"><RealmView realm={lib.realm as any} />{libName}</span>, children });
		}

		items.push(librariesSection);

		const typesSection: Item = { title: <span>Types</span>, children: [] };
		for (const [typeName, type] of Object.entries(docs?.Types ?? {})) {
			const children = [];
			for (const [methodName, method] of Object.entries(type.methods)) {
				if (!filter(`${typeName}:${methodName}`)) continue;

				children.push({
					title: <span className="flex flex-row gap-1 items-center"><RealmView realm={method.realm as any} /> {methodName}</span>,
					callback() {
						window.location.hash = `types.${typeName}.${methodName}`;
					}
				});
			}

			typesSection.children.push({ title: <span>{typeName}</span>, children });
		}
		items.push(typesSection);

		const hooksSection: Item = { title: <span>Hooks</span>, children: [] };
		for (const [hookName, hook] of Object.entries(docs?.Hooks ?? {})) {
			if (!filter(hookName)) continue;

			hooksSection.children.push({
				title: <span className="flex flex-row gap-1 items-center"><RealmView realm={hook.realm as any} /> {hookName}</span>,
				callback() {
					window.location.hash = `hooks.${hookName}`;
				}
			});
		}
		items.push(hooksSection);

		const directivesSection: Item = { title: <span>Directives</span>, children: [] };
		for (const [directiveName, _] of Object.entries(docs?.Directives ?? {})) {
			if (!filter(directiveName)) continue;

			directivesSection.children.push({
				title: <span>{`@${directiveName}`}</span>,
				callback() {
					window.location.hash = `directives.${directiveName}`;
				}
			});
		}
		items.push(directivesSection);

		setItems(items);
	}, [docs, search]);

	return (
		<div className={`bg-zinc-800 text-white flex flex-col gap-2 p-1 lg:px-4 lg:py-2 h-full ${props.className ?? ""}`}>
			<div className="flex flex-row items-center gap-2">
				<img src={Logo} className="size-8 lg:size-16" />

				<span className="text-2xl lg:text-4xl overflow-hidden">Neostarfall</span>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex flex-row gap-2 py-2 lg:py-1 text-sm lg:text-base items-center border-b border-white" onClick={() => searchInputRef.current?.focus()}>
					<IoSearch className="hidden lg:block"/>
					<input className="outline-none" placeholder="Search" ref={searchInputRef} onChange={e => setSearch(e.currentTarget.value)}></input>
				</div>

				<Tree items={items} expandAll={openByDefault}/>
			</div>
		</div>
	);
}