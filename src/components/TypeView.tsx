import { useDocs } from "../lib/docs";

const SF_TYPE_COLOR = "text-blue-400";
const NATIVE_TYPE_COLOR = "text-blue-400";

// todo: handle unions and ?
export default function TypeView(props: { name: string }) {
	const docs = useDocs();

	if (!docs) {
		return props.name;
	}

	// It's a base type
	if (!docs.Types[props.name]) {
		return <span className={NATIVE_TYPE_COLOR}>{props.name}</span>
	}

	const type = docs.Types[props.name];

	return (
		<a className={SF_TYPE_COLOR} href={`#types.${type.name}`}>
			{type.name}
		</a>
	)
}