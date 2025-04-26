import { useEffect, useState } from "react";

export type Example = {
	fileName: string;
	rawUrl: string;
}

export async function fetchExamples(): Promise<Example[]> {
	const response = await fetch("https://api.github.com/repos/neostarfall/neostarfall/contents/lua/starfall/examples");

	const responseJson: { name: string, download_url: string }[] = await response.json();

	return responseJson.map((f) => ({
		fileName: f.name,
		rawUrl: f.download_url,
	}));
}

export function useExamples(): Example[] {
	const [examples, setExamples] = useState<Example[]>([]);
	const [isFetching, setIsFetching] = useState(false);

	useEffect(() => {
		if (isFetching) return;

		fetchExamples()
			.then(setExamples)
			.finally(() => setIsFetching(false));
	}, []);

	return examples;
}