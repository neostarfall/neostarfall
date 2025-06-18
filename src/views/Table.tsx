import RealmView, { type Realm } from "../components/RealmView";
import ParamsView from "../components/ParamsView";
import TypeView from "../components/TypeView";
import { type SFDocMethodEntry, SFDocTableEntry, useDocs } from "../lib/docs";
import { getGithubLinkFromPath } from "../lib/src";
import { formatDescription } from "../lib/format";

export function InlineTable(props: {
    lib?: string;
    type?: string;
    name: string;
}) {
    const docs = useDocs();

    if (!props.lib && !props.type) {
        return "What";
    }

    let table: SFDocTableEntry | undefined;
    let separator = ".";
    if (props.lib) {
        table = docs?.Libraries[props.lib].tables[props.name];
    }

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

                    {(() => {
                        if (props.lib !== "builtins") {
                            return (
                                <>
                                    <button
                                        type="button"
                                        className="text-blue-400 hover:cursor-pointer"
                                        onClick={() => {
                                            window.location.hash = `libraries.${props.lib}`
                                        }}
                                    >
                                        {props.lib ?? props.type}
                                    </button>

                                    {separator}
                                </>
                            );
                        }
                    })()}

                    {table.name}
                </button>

                <a
                    className="text-2xl font-bold"
                    href={getGithubLinkFromPath(table.path)}
                >
                    [src]
                </a>
            </div>

            <pre className="text-wrap lg:px-2">
                {formatDescription(table.description)}
            </pre>

            <div className="flex flex-col gap-4 bg-red-500">
                {table.fields.map((field) => (
                    <div>
                        {field.name} : {field.description}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Table(props: {
    lib?: string;
    type?: string;
    name: string;
}) {
    return (
        <div className="bg-zinc-800 w-full h-full text-white p-2 md:p-4 lg:p-8 flex flex-col gap-2 overflow-y-auto">
            <InlineTable lib={props.lib} type={props.type} name={props.name} />
        </div>
    );
}
