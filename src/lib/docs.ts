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

class GlobalDocManager {
	private docs: SFDocs | null = null;
	private listeners: Array<(docs: SFDocs) => void> = [];

	setDocs(docs: SFDocs) {
		this.docs = docs;

		for (const listener of this.listeners) {
			listener(docs);
		}
	}

	hasDocs(): boolean {
		return this.docs !== null;
	}

	getDocs(): SFDocs | null {
		return this.docs;
	}

	addListener(listener: (docs: SFDocs) => void) {
		if (this.docs) {
			listener(this.docs);
		} else {
			this.listeners.push(listener);
		}
	}

	removeListener(listener: (docs: SFDocs) => void) {
		const index = this.listeners.indexOf(listener);
		if (index !== -1) {
			this.listeners.splice(index, 1);
		}
	}
}

window.globalDocManager = new GlobalDocManager();

export function useDocs() {
	const [docs, setDocs] = useState<SFDocs | null>(null);

	useEffect(() => {
		const onUpdate = (docs: SFDocs) => setDocs(docs);
		window.globalDocManager.addListener(onUpdate);

		if (!window.globalDocManager.hasDocs()) {
			fetchSFDocs().then((fetchedDocs) => {
				window.globalDocManager.setDocs(fetchedDocs);
			});
		}

		return () => {
			window.globalDocManager.removeListener(onUpdate);
		};
	}, []);

	return docs;
}
