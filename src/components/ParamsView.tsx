import { useState } from "react";
import TypeView from "./TypeView";

export default function ParamsView(props: {
	params?: { name: string; type: string }[];
	className?: string;
}) {
	const params = props.params ?? [];

	const [showParams, setShowParams] = useState(params.length <= 5);

	const innerParams = params.map((param, index) => (
		<div key={`${param.name}-${param.type}`} className="flex flex-row">
			<div className="flex flex-row gap-2">
				<TypeView name={param.type} />
				<span className="text-gray-400">{param.name}</span>
			</div>

			{index !== params.length - 1 && <pre>, </pre>}
		</div>
	));

	return (
		<div className={`flex flex-row ${props.className ?? ""}`}>
			<span>(</span>
			{(() => {
				if (showParams) {
					return innerParams;
				} else {
					return (
						<>
							{innerParams.slice(0, 5)}
							<button onClick={() => setShowParams(true)} className="text-gray-400 text-nowrap">
								[+{params.length - 5} more]
							</button>
						</>
					)
				}
			})()}
			<span>)</span>
		</div>
	);
}
