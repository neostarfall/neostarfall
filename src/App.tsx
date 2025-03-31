import { createRoot } from "react-dom/client";
import "./index.css";

import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { fetchSFDocs, globalDocManager } from "./lib/docs";

function App() {
	return (
		<div className="flex flex-row w-dvw h-dvh overflow-hidden">
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
	const docs = await fetchSFDocs();
	globalDocManager.setDocs(docs);
}
