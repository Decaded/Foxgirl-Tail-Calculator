import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const bad = [];

function walk(dir) {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) {
			walk(path);
		} else if (/\.(ts|tsx|css)$/.test(entry) && entry !== "tokens.css") {
			readFileSync(path, "utf8")
				.split("\n")
				.forEach((line, i) => {
					if (/#[0-9a-fA-F]{3,8}\b/.test(line))
						bad.push(`${path}:${i + 1}: ${line.trim()}`);
				});
		}
	}
}

walk("src");

if (bad.length) {
	console.error(`Color literals outside tokens.css:\n${bad.join("\n")}`);
	process.exit(1);
}
