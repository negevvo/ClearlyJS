import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/bundle.cjs.js",
            format: "cjs",
            sourcemap: true,
        },
        {
            file: "dist/bundle.esm.js",
            format: "es",
            sourcemap: true,
        },
        {
            file: "dist/bundle.umd.js",
            format: "umd",
            name: "MyLibrary",
            sourcemap: true,
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: "./tsconfig.json",
        }),
        terser(),
    ],
};
