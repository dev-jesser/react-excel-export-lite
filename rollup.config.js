import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/lib/useExcelExporter.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [typescript()],
  external: ["react", "exceljs"]
};