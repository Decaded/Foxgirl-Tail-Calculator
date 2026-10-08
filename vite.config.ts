import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [preact(), tailwindcss()],
	test: {
		environment: "node",
	},
});
