import RealmView, { type Realm } from "../components/RealmView";
import { type SFDocTableEntry, useDocs } from "../lib/docs";
import { getGithubLinkFromPath } from "../lib/src";
import { formatDescription } from "../lib/format";
import { ItemBuilder } from "@/components/LeftPanel";
import { Item } from "@/components/Tree";

export const getEnumItem: ItemBuilder = (docs, examples, filter) => {
    const globalsSection: Item = {
        title: <span>Enums</span>,
        key: "enums",
        children: [],
    };

    for (const [name, global] of Object.entries(
        docs.Libraries.builtins.tables ?? {},
    )) {
        if (!filter(name)) continue;

        globalsSection.children.push({
            title: (
                <span className="flex flex-row gap-1 items-center">
                    <RealmView realm={global.realm} />
                    {name}
                </span>
            ),
            key: `enums.${name}`,
            callback() {
                window.location.hash = `enums.${name}`;
            },
        });
    }

    return globalsSection;
};

export function InlineEnum(props: { name: string; }) {
    const docs = useDocs();

    let table: SFDocTableEntry | undefined;
    let separator = ".";

    table = docs?.Libraries?.builtins.tables[props.name];

    if (!table) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between px-2 py-2">
                <button
                    type="button"
                    className="text-lg lg:text-2xl font-bold px-2 py-1 rounded-md outline-none bg-zinc-900 w-fit flex flex-row justify-start items-center font-mono"
                >
                    <RealmView
                        realm={table.realm}
                        className="mr-2 size-6 hidden md:inline"
                    />

                    {table.name}
                </button>

                <a
                    className="text-2xl font-bold"
                    href={getGithubLinkFromPath(table.path)}
                >
                    [src]
                </a>
            </div>

            <pre className="text-wrap">
                {formatDescription(table.description)}
            </pre>

            <div className="flex flex-col gap-4">
                {table.fields.map((field) => (
                    <div className="flex flex-col gap-2" key={field.name}>
                        <code className="rounded-md bg-zinc-900 px-2 py-1 text-sm font-mono">
                            {table.name}
                            .
                            <span className="text-blue-500">{field.name}</span>
                        </code>

                        <span className="text-sm text-zinc-400">
                            {(() => {
                                if (!field.description || field.description.trim().length === 0) {
                                    return "No description found.";
                                }

                                return formatDescription(field.description);
                            })()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Enum(props: {
    name: string;
}) {
    return (
        <div className="bg-zinc-800 w-full h-full text-white p-2 md:p-4 lg:p-8 flex flex-col gap-2 overflow-y-auto">
            <InlineEnum name={props.name} />
        </div>
    );
}
