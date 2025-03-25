export function formatDescription(rawDesc: string): string {
	return rawDesc.trim().replaceAll("\n ", "\n");
}
