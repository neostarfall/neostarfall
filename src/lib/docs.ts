import { useEffect, useState } from "react";

interface SFDocEntry {
	class: string;
	description: string;
	name: string;
	path: string;
	realm: string;
}

interface SFDocParam {
	type: string;
	name: string;
	description: string;
	value: string;
}

export interface SFDocMethodEntry extends SFDocEntry {
	params: SFDocParam[];
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

interface SFDocDirectiveEntry extends SFDocEntry {
}

export type SFDocs = {
	Libraries: Record<string, SFDocLibraryEntry>,
	Hooks: Record<string, SFDocHookEntry>,
	Directives: Record<string, SFDocDirectiveEntry>,
	Types: Record<string, SFDocTypeEntry>,

	Version: string
}

let CachedDocs: SFDocs | null = null;

export async function getSFDocs(): Promise<SFDocs> {
	if (CachedDocs) {
		return CachedDocs;
	}

	const docs = await fetch("/sf_doc.json");
	const docsJson = await docs.json();

	return CachedDocs = docsJson as SFDocs;
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