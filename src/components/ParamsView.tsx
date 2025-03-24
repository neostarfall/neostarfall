import TypeView from "./TypeView";

export default function ParamsView(props: {
	params?: { name: string; type: string }[];
	className?: string;
}) {
	const params = props.params ?? [];

	return (
		<div className={`flex flex-row ${props.className ?? ""}`}>
			<span>(</span>
			{params.map((param, index) => (
				<div key={`${param.name}-${param.type}`} className="flex flex-row">
					<div className="flex flex-row gap-2">
						<TypeView name={param.type} />
						<span className="text-gray-400">{param.name}</span>
					</div>

					{index !== params.length - 1 && <pre>, </pre>}
				</div>
			))}
			<span>)</span>
		</div>
	);
}
