import { createRoot } from "react-dom/client";
import "./index.css";

import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {
	return (
		<div className="flex flex-row w-dvw h-dvh">
			<LeftPanel className="w-40 lg:w-96 h-full border-r border-white" />
			<RightPanel className="h-full" />
		</div>
	);
}

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
