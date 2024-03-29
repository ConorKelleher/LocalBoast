import { defineConfig } from "vite"
import typescript from "@rollup/plugin-typescript"
import copy from "rollup-plugin-copy"
import path from "path"
import glob from "glob"
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "localboast/*": path.resolve(__dirname, "./src/*"),
    },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
  build: {
    manifest: false,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      fileName: "index",
      // formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      input: glob.sync(path.resolve(__dirname, "src/**/index.ts")),
      output: [
        {
          sourcemap: "inline",
          dir: "build",
          preserveModules: true,
          format: "es",
          entryFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`,
        },
        {
          sourcemap: "inline",
          dir: "build",
          preserveModules: true,
          format: "cjs",
          entryFileNames: `[name].cjs`,
          assetFileNames: `[name].[ext]`,
        },
      ],
      plugins: [
        excludeDependenciesFromBundle(),
        typescript({
          sourceMap: true,
          declaration: true,
          outDir: "build",
          allowImportingTsExtensions: false,
          exclude: [
            "**/__tests__/**",
            "**/*.test.ts",
            "**/stories/**",
            "**/*.stories.ts",
            "**/storybook_utils/**",
            "**/test_utils/**",
          ],
        }),
        copy({
          verbose: true,
          hook: "writeBundle",
          targets: [
            {
              src: "src/internal/*.d.ts",
              dest: "build/internal",
            },
            {
              src: "src/internal/*.js",
              dest: "build/internal",
            },
          ],
        }),
      ],
    },
  },
})
