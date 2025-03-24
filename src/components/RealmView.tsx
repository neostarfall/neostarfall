type Realm = "client" | "server" | "shared";

const ServerColor = "#4287f5";
const ClientColor = "#e68e29";

export default function RealmView(props: { realm: Realm }) {
	if (props.realm === "client") {
		return <div className="size-4 rounded-sm inline-block" style={{background: ClientColor}} />
	}

	if (props.realm === "server") {
		return <div className="size-4 rounded-sm inline-block" style={{background: ServerColor}} />
	}

	return (
		<div className="size-4 rounded-sm inline-block" style={{background: `linear-gradient(45deg, ${ClientColor} 49%, ${ServerColor} 50%)`}} />
	)
}