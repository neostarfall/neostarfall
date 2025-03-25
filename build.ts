#!/usr/bin/env bun
import { build, BunPlugin, type BuildConfig } from "bun";
import plugin from "bun-plugin-tailwind";
import { existsSync, readFileSync, readSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";

// Print help text if requested
if (process.argv.includes("--help") || process.argv.includes("-h")) {
	console.log(`
🏗️  Bun Build Script

Usage: bun run build.ts [options]

Common Options:
  --outdir <path>          Output directory (default: "dist")
  --minify                 Enable minification (or --minify.whitespace, --minify.syntax, etc)
  --source-map <type>      Sourcemap type: none|linked|inline|external
  --target <target>        Build target: browser|bun|node
  --format <format>        Output format: esm|cjs|iife
  --splitting              Enable code splitting
  --packages <type>        Package handling: bundle|external
  --public-path <path>     Public path for assets
  --env <mode>             Environment handling: inline|disable|prefix*
  --conditions <list>      Package.json export conditions (comma separated)
  --external <list>        External packages (comma separated)
  --banner <text>          Add banner text to output
  --footer <text>          Add footer text to output
  --define <obj>           Define global constants (e.g. --define.VERSION=1.0.0)
  --help, -h               Show this help message

Example:
  bun run build.ts --outdir=dist --minify --source-map=linked --external=react,react-dom
`);
	process.exit(0);
}

// Helper function to convert kebab-case to camelCase
const toCamelCase = (str: string): string => {
	return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

// Helper function to parse a value into appropriate type
const parseValue = (value: string): any => {
	// Handle true/false strings
	if (value === "true") return true;
	if (value === "false") return false;

	// Handle numbers
	if (/^\d+$/.test(value)) return parseInt(value, 10);
	if (/^\d*\.\d+$/.test(value)) return parseFloat(value);

	// Handle arrays (comma-separated)
	if (value.includes(",")) return value.split(",").map((v) => v.trim());

	// Default to string
	return value;
};

// Magical argument parser that converts CLI args to BuildConfig
function parseArgs(): Partial<BuildConfig> {
	const config: Record<string, any> = {};
	const args = process.argv.slice(2);

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (!arg.startsWith("--")) continue;

		// Handle --no-* flags
		if (arg.startsWith("--no-")) {
			const key = toCamelCase(arg.slice(5));
			config[key] = false;
			continue;
		}

		// Handle --flag (boolean true)
		if (
			!arg.includes("=") &&
			(i === args.length - 1 || args[i + 1].startsWith("--"))
		) {
			const key = toCamelCase(arg.slice(2));
			config[key] = true;
			continue;
		}

		// Handle --key=value or --key value
		let key: string;
		let value: string;

		if (arg.includes("=")) {
			[key, value] = arg.slice(2).split("=", 2);
		} else {
			key = arg.slice(2);
			value = args[++i];
		}

		// Convert kebab-case key to camelCase
		key = toCamelCase(key);

		// Handle nested properties (e.g. --minify.whitespace)
		if (key.includes(".")) {
			const [parentKey, childKey] = key.split(".");
			config[parentKey] = config[parentKey] || {};
			config[parentKey][childKey] = parseValue(value);
		} else {
			config[key] = parseValue(value);
		}
	}

	return config as Partial<BuildConfig>;
}

// Helper function to format file sizes
const formatFileSize = (bytes: number): string => {
	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
};

console.log("\n🚀 Starting build process...\n");

// Parse CLI arguments with our magical parser
const cliConfig = parseArgs();
const outdir = cliConfig.outdir || path.join(process.cwd(), "dist");

if (existsSync(outdir)) {
	console.log(`🗑️ Cleaning previous build at ${outdir}`);
	await rm(outdir, { recursive: true, force: true });
}

const start = performance.now();

// Build all the HTML files
const result = await build({
	entrypoints: [path.resolve("./src/index.html")],
	outdir,
	plugins: [plugin],
	minify: true,
	target: "browser",
	sourcemap: "none",
	splitting: false,
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
	...cliConfig, // Merge in any CLI-provided options
});

const outputHtml = result.outputs.find(
	(s) => path.basename(s.path) === "index.html",
);

if (!outputHtml) {
	throw new Error("No index.html output found");
}

const outputHtmlContent = await Bun.file(outputHtml.path).text();

const rewriter = new HTMLRewriter()
	.on("link", {
		async element(e) {
			const href = e.getAttribute("href");
			if (href?.endsWith(".svg")) {
				e.remove();
			} else if (href?.endsWith(".css")) {
				const cssPath = path.resolve(path.dirname(outputHtml.path), href);
				if (existsSync(cssPath)) {
					const cssContent = readFileSync(cssPath, "utf-8");
					e.replace(`<style>${cssContent}</style>`, { html: true });
				} else {
					console.warn(`⚠️  CSS file not found: ${cssPath}`);
				}
			}
		},
	})
	.on("script", {
		async element(e) {
			const src = e.getAttribute("src");
			if (src) {
				const scriptPath = path.resolve(path.dirname(outputHtml.path), src);
				if (existsSync(scriptPath)) {
					e.removeAttribute("src");

					const scriptContent = readFileSync(scriptPath, "utf-8").replaceAll(
						"</script>",
						"\\x3C/script>",
					);

					e.setInnerContent(scriptContent, { html: true });
				} else {
					console.warn(`⚠️  Script file not found: ${scriptPath}`);
				}
			}
		},
	});

const out = rewriter.transform(outputHtmlContent);

const distDir = path.join(process.cwd(), "dist");
if (existsSync(distDir)) {
	// Clear remaining files
	await rm(distDir, { recursive: true, force: true });
}

await Bun.write("./dist/index.html", out);

const end = performance.now();

const buildTime = (end - start).toFixed(2);

console.log(`\n✅ Build completed in ${buildTime}ms\n`);
