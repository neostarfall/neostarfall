import Method from "../views/Method";
import { useHash } from "../lib/hash";
import { useEffect, useState } from "react";
import Hook from "../views/Hook";
import Directive from "@/views/Directive";
import Type from "../views/Type";
import Contributors from "../views/Contributors";
import Library from "../views/Library";
import Example from "@/views/Example";

export default function RightPanel(props: { className?: string }) {
	const hash = useHash();
	const [parts, setParts] = useState<string[]>([]);
	const afterFirstDot = hash.indexOf(".") && hash.slice(hash.indexOf(".") + 1);

	useEffect(() => {
		const withoutHash = hash.slice(1);
		const parts = withoutHash.split(".");

		setParts(parts);
	}, [hash]);

	if (parts[0] === "types") {
		const typeName = parts[1];
		const methodName = parts[2];

		if (typeName && methodName) {
			return <Method type={typeName} name={methodName} />;
		}

		if (typeName) {
			return <Type name={typeName} />;
		}
	}

	if (parts[0] === "libraries") {
		const libName = parts[1];
		const methodName = parts[2];

		if (libName && methodName) {
			return <Method lib={libName} name={methodName} />;
		}

		if (libName) {
			return <Library name={libName} />;
		}
	}

	if (parts[0] === "hooks") {
		const hookName = parts[1];

		if (hookName) {
			return <Hook name={hookName} />;
		}
	}

	if (parts[0] === "directives") {
		const directiveName = parts[1];

		if (directiveName) {
			return <Directive name={directiveName} />;
		}
	}

	if (parts[0] === "contributors") {
		return <Contributors />;
	}

	if (parts[0] === "examples") {
		const exampleFileName = afterFirstDot;

		if (exampleFileName) {
			return <Example name={exampleFileName} />;
		}
	}

	return <Contributors />;
}
