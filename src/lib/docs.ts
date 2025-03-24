import { useEffect, useState } from "react";

interface SFDocEntry {
	class: string;
	description: string;
	name: string;
	path: string;
	realm: "client" | "server" | "shared";
}

interface SFDocParam {
	type: string;
	name: string;
	description: string;
	value: string;
}

export interface SFDocMethodEntry extends SFDocEntry {
	params: SFDocParam[];
	returns: SFDocParam[];
}

export interface SFDocLibraryEntry extends SFDocEntry {
	libtbl: string;
	methods: Record<string, SFDocMethodEntry>;
}

export interface SFDocTypeEntry extends SFDocEntry {
	libtbl: string;
	methods: Record<string, SFDocMethodEntry>;
}

interface SFDocHookEntry extends SFDocEntry {
	params: SFDocParam[];
}

interface SFDocDirectiveEntry extends SFDocEntry {}

export type SFDocs = {
	Libraries: Record<string, SFDocLibraryEntry>;
	Hooks: Record<string, SFDocHookEntry>;
	Directives: Record<string, SFDocDirectiveEntry>;
	Types: Record<string, SFDocTypeEntry>;

	Version: string;
};

// This is stored on the window so DHTML can inject the local json through here.
declare namespace window {
	let CachedDocs: SFDocs | null;
}

export async function getSFDocs(): Promise<SFDocs> {
	if (window.CachedDocs) {
		return window.CachedDocs;
	}

	const docs = await fetch(
		"https://raw.githubusercontent.com/neostarfall/neostarfall/refs/heads/gh-pages/sf_doc.json",
	);
	const docsJson = await docs.json();

	window.CachedDocs = docsJson as SFDocs;

	return window.CachedDocs;
}

export function useDocs() {
	const [docs, setDocs] = useState<SFDocs | null>(null);

	useEffect(() => {
		const fetchDocs = async () => {
			const docs = await getSFDocs();
			setDocs(docs);
		};

		fetchDocs();
	}, []);

	return docs;
}
