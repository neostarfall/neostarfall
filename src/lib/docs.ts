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
	let globalDocManager: GlobalDocManager;
}

export async function fetchSFDocs(): Promise<SFDocs> {
	const docs = await fetch(
		"https://raw.githubusercontent.com/neostarfall/neostarfall/refs/heads/gh-pages/sf_doc.json",
	);

	return await docs.json();
}

class GlobalDocManager extends EventTarget {
	private docs: SFDocs | null = null;

	setDocs(docs: SFDocs) {
		this.docs = docs;
		this.dispatchEvent(new CustomEvent("docsLoaded", { detail: docs }));
	}

	hasDocs(): boolean {
		return this.docs !== null;
	}

	getDocs(): SFDocs | null {
		return this.docs;
	}
}

export const globalDocManager = new GlobalDocManager();
window.globalDocManager = globalDocManager;

export function useDocs() {
	const [docs, setDocs] = useState<SFDocs | null>(null);

	useEffect(() => {
		const onUpdate = (e: Event) => {
			const customEvent = e as CustomEvent<SFDocs>;
			setDocs(customEvent.detail);
		};

		if (window.globalDocManager.hasDocs()) {
			setDocs(window.globalDocManager.getDocs());
		}

		window.globalDocManager.addEventListener("docsLoaded", onUpdate);

		return () => {
			window.globalDocManager.removeEventListener("docsLoaded", onUpdate);
		};
	}, []);

	return docs;
}
