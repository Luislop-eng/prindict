import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths: the build works from any sub-path
  // (e.g. GitHub Pages at https://<user>.github.io/prindict/).
  base: "./",
  plugins: [react()],
});
