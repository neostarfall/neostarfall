type Type =
	| { variant: "union"; items: Type[] }
	| { variant: "nullable"; item: Type }
	| { variant: "extern"; name: string };

export function parseType(rawType: string): Type {
	throw new Error("Todo");
}
