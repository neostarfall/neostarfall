import { type JSX, useState } from "react";

export type Item = ({ children: Item[] } | { callback: () => void }) & {
	title: JSX.Element;
	key: string;
};

function Item(props: { item: Item; expand?: boolean }) {
	const [hidden, setHidden] = useState(!props.expand);

	const isHidden = props.expand ? false : hidden;

	if ("children" in props.item) {
		const prevSymbol = isHidden ? "+" : "-";

		return (
			<li className="outline-none select-none">
				<button
					type="button"
					className="flex py-2 lg:py-0 flex-row gap-1 hover:cursor-pointer outline-none"
					onClick={() => setHidden(!hidden)}
				>
					<pre>{prevSymbol}</pre>
					{props.item.title}
				</button>

				<ol
					className={`${isHidden ? "hidden" : "block"} outline-none list-inside pl-2`}
				>
					{props.item.children.map((item) => (
						<Item
							item={item}
							key={`${props.item.key}-${item.key}`}
							expand={props.expand}
						/>
					))}
				</ol>
			</li>
		);
	}

	const prevSymbol = " ";

	return (
		<li className="outline-none select-none">
			<button
				type="button"
				className="flex py-2 lg:py-0 flex-row gap-1 hover:cursor-pointer outline-none"
				onClick={() => {
					if ("callback" in props.item) {
						props.item.callback();
					}
				}}
			>
				<pre>{prevSymbol}</pre>
				{props.item.title}
			</button>
		</li>
	);
}

export default function Tree(props: { items: Item[]; expandAll?: boolean }) {
	return (
		<ol className="font-mono text-sm lg:text-base w-full max-h-[400px] md:max-h-[600px] overflow-y-auto overflow-x-clip">
			{props.items.map((item) => (
				<Item item={item} key={item.key} expand={props.expandAll} />
			))}
		</ol>
	);
}
