/* eslint-env node */

import { chrome } from "../../electron-vendors.config.json";
import { join } from "path";
import { builtinModules } from "module";
import { defineConfig } from "vite";
import electron from "vitejs-plugin-electron";
import { loadAndSetEnv } from "../../scripts/loadAndSetEnv.mjs";

const PACKAGE_ROOT = __dirname;
console.log("服务进程：" + join(PACKAGE_ROOT, "src") + "/");
/**
 * Vite looks for `.env.[mode]` files only in `PACKAGE_ROOT` directory.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */
loadAndSetEnv(process.env.MODE, process.cwd());

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "/SERVICES/": join(PACKAGE_ROOT, "src") + "/",
    },
  },
  plugins: [electron()],
  base: "",
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    rollupOptions: {
      external: ["electron", "electron-store", ...builtinModules],
    },
    emptyOutDir: true,
  },
});
