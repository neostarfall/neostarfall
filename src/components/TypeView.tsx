import { useDocs } from "../lib/docs";

const SF_TYPE_COLOR = "text-blue-400";
const NATIVE_TYPE_COLOR = "text-blue-400";

// todo: handle unions and ?
export default function TypeView(props: { name: string; className?: string }) {
	const docs = useDocs();

	if (!docs) {
		return props.name;
	}

	// It's a base type
	if (!docs.Types[props.name]) {
		return (
			<span className={`${NATIVE_TYPE_COLOR} ${props.className ?? ""}`}>
				{props.name}
			</span>
		);
	}

	const type = docs.Types[props.name];

	return (
		<button
			type="button"
			className={`${SF_TYPE_COLOR} ${props.className ?? ""} hover:cursor-pointer`}
			onClick={() => {
				window.location.hash = `#types.${type.name}`;
			}}
		>
			{type.name}
		</button>
	);
}
