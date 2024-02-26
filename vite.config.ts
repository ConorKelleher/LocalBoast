import { defineConfig } from "vite"
import typescript from "@rollup/plugin-typescript"
import path from "path"
import { typescriptPaths } from "rollup-plugin-typescript-paths"
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      localboast: path.resolve(__dirname, "./src/index.ts"),
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
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      output: {
        sourcemap: true,
        dir: ".",
      },
      plugins: [
        excludeDependenciesFromBundle(),
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: true,
          declaration: true,
          emitDeclarationOnly: true,
          outDir: "lib",
          allowImportingTsExtensions: false,
          // include: ["**/src/components/**", "**/src/hooks/**"],
          exclude: [
            "**/__tests__/**",
            "**/*.test.ts",
            "**/stories/**",
            "**/*.stories.ts",
            "**/storybook_utils/**",
            "**/test_utils/**",
          ],
        }),
      ],
    },
  },
})
