import { useDocs } from "../lib/docs";

const SF_TYPE_COLOR = "text-blue-400";
const NATIVE_TYPE_COLOR = "text-blue-400";

// todo: handle unions and ?
export default function TypeView(props: { name: string; className?: string }) {
	const docs = useDocs();

	if (!docs) {
		return props.name;
	}

	const classData = docs.Types[props.name];
	if (!classData) {
		// It's a native type, or a struct (todo)
		return (
			<span
				className={`${NATIVE_TYPE_COLOR} text-nowrap ${props.className ?? ""}`}
			>
				{props.name}
			</span>
		);
	}

	return (
		<button
			type="button"
			className={`${SF_TYPE_COLOR} ${props.className ?? ""} text-nowrap hover:cursor-pointer`}
			onClick={() => {
				window.location.hash = `#classes.${classData.name}`;
			}}
		>
			{classData.name}
		</button>
	);
}
