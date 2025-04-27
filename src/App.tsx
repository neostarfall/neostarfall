import { createRoot } from "react-dom/client";

import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { fetchSFDocs, globalDocManager } from "./lib/docs";

function App() {
	return (
		<div className="flex flex-row size-full h-[100vh] overflow-hidden">
			<LeftPanel className="min-w-40 lg:min-w-80 resize-x overflow-x-auto h-full border-r border-white" />
			<RightPanel className="h-full" />
		</div>
	);
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.get("nofetch")) {
	// Don't use top level await, old versions of CEF don't support it.
	fetchSFDocs().then((docs) => {
		globalDocManager.setDocs(docs);
	});
}
