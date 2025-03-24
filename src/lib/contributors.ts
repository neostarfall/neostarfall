import { useEffect, useState } from "react";

const HiddenList: Record<string, true> = {
	"web-flow": true,
	"\x74\x68\x65\x67\x72\x62\x39\x33": true,
};

type Contributor = {
	name: string;
	link: string;
	avatar: string;
	contributions: number;
	hidden: boolean;
};

type RawResponse = {
	login: string;
	avatar_url: string;
	html_url: string;
	type: string;
	contributions: number;
}[];

let CachedContributors: Contributor[] | null = null;

export async function getContributors(): Promise<Contributor[]> {
	if (CachedContributors) {
		return CachedContributors;
	}

	const response = await fetch(
		"https://api.github.com/repos/neostarfall/neostarfall/contributors?per_page=100",
	);

	const responseJson: RawResponse = await response.json();

	CachedContributors = responseJson.map((c) => ({
		name: c.login,
		link: c.html_url,
		avatar: c.avatar_url,
		contributions: c.contributions,
		hidden: HiddenList[c.login],
	}));

	return CachedContributors;
}

export function useContributors(): Contributor[] {
	const [contributors, setContributors] = useState<Contributor[]>([]);

	useEffect(() => {
		getContributors().then(setContributors);
	}, []);

	return contributors;
}
