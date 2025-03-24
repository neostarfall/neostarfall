import { JSX, useState } from "react";

export type Item = ({ children: Item[] } | { callback: () => void }) & { title: JSX.Element }

function Item(props: { item: Item, expand?: boolean }) {
	const [hidden, setHidden] = useState(!props.expand);

	if ("children" in props.item) {
		const prevSymbol = hidden ? "+" : "-";

		return (
			<li className="outline-none select-none">
				<button className="flex py-2 lg:py-0 flex-row gap-1 hover:cursor-pointer outline-none" onClick={() => setHidden(!hidden)}>
					<pre>{prevSymbol}</pre>
					{props.item.title}
				</button>

				<ol className={`${hidden ? "hidden" : ""} outline-none list-inside pl-2`}>
					{props.item.children.map((item, i) => (
						<Item item={item} key={i} expand={props.expand} />
					))}
				</ol>
			</li>
		);
	}

	const prevSymbol = " ";

	return (
		<li className="outline-none select-none">
			<button className="flex py-2 lg:py-0 flex-row gap-1 hover:cursor-pointer outline-none" onClick={() => {
				if ("callback" in props.item) {
					props.item.callback();
				}
			}}>
				<pre>{prevSymbol}</pre>
				{props.item.title}
			</button>
		</li>
	)
}

export default function Tree(props: { items: Item[], expandAll?: boolean }) {
	return (
		<ol className="font-mono text-sm lg:text-base w-full max-h-96 overflow-y-auto overflow-x-clip">
			{props.items.map((item, i) => (
				<Item item={item} key={i} expand={props.expandAll} />
			))}
		</ol>
	);
}