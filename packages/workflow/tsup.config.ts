import { defineConfig } from "tsup";

export default defineConfig({
  entry: ['./src/index.test.ts'],
  outDir: './dist',
  format: 'cjs',
  splitting: false,
  noExternal: ['@echoai/utils'],
  external: ['fs']
})
