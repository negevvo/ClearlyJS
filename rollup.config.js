import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/clearly.cjs.js",
            format: "cjs",
            sourcemap: true,
        },
        {
            file: "dist/clearly.esm.js",
            format: "es",
            sourcemap: true,
        },
        {
            file: "dist/clearly.umd.js",
            format: "umd",
            name: "ClearlyJS",
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
