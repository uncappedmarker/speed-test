import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	root: "./src",
	build: {
		outDir: path.resolve("..", "dist", "frontend"),
		emptyOutDir: true,
		sourcemap: true,
		minify: true,
	},
});
