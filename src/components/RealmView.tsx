export type Realm = "client" | "server" | "shared";

const ServerColor = "#4287f5";
const ClientColor = "#e68e29";

export default function RealmView(props: {
	realm?: Realm;
	className?: string;
}) {
	const styling = `size-4 rounded-sm inline-block ${props.className ?? ""}`;

	if (props.realm === "client") {
		return (
			<div
				title="Clientside"
				className={styling}
				style={{ background: ClientColor }}
			/>
		);
	}

	if (props.realm === "server") {
		return (
			<div
				title="Serverside"
				className={styling}
				style={{ background: ServerColor }}
			/>
		);
	}

	return (
		<div
			title="Shared"
			className={styling}
			style={{
				background: `linear-gradient(45deg, ${ClientColor} 49%, ${ServerColor} 50%)`,
			}}
		/>
	);
}
