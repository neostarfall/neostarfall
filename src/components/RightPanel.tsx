import Method from "../views/Method";
import { useHash } from "../lib/hash"
import { useEffect, useState } from "react";
import Hook from "@/views/Hook";
import Directive from "@/views/Directive";

export default function RightPanel(props: { className?: string }) {
	const hash = useHash();
	const [parts, setParts] = useState<string[]>([]);

	useEffect(() => {
		const withoutHash = hash.slice(1);
		const parts = withoutHash.split(".");

		setParts(parts);
	}, [hash]);

	console.log(parts);

	if (parts[0] === "types") {
		const typeName = parts[1];
		const methodName = parts[2];

		if (typeName && methodName) {
			return <Method type={typeName} name={methodName} />
		}

		if (typeName) {
			return "Type here";
		}
	}

	if (parts[0] === "libraries") {
		const libName = parts[1];
		const methodName = parts[2];

		if (libName && methodName) {
			return <Method lib={libName} name={methodName} />
		}

		if (libName) {
			return "Library here";
		}
	}

	if (parts[0] === "hooks") {
		const hookName = parts[1];

		if (hookName) {
			return <Hook name={hookName} />
		}
	}

	if (parts[0] === "directives") {
		const directiveName = parts[1];

		if (directiveName) {
			return <Directive name={directiveName} />
		}
	}

	return (
		<div className="w-full h-full p-2 bg-zinc-800">
			Right panel h!ere
		</div>
	)
}