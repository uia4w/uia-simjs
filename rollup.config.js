const definition = require("./package.json");

import nodeResolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from "rollup-plugin-terser";

const ENV = "dev"

export default {
    input: 'src/main.js',
    output: [
        {
            extend: true,
            file: `dist//${definition.name}.js`,
            format: "umd",
            name: `${definition.name}`
        },
        {
            extend: true,
            file: `dist//${definition.name}.min.js`,
            format: "umd",
            name: `${definition.name}`,
            plugins: [ terser() ] 
        }
    ],
    plugins: [ 
        builtins(),
        nodeResolve()
    ]
};
