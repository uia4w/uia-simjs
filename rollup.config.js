import nodeResolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/simjs.js',
        format: 'umd',
        name: "simjs"
    },
    plugins: [ 
        builtins(),
        nodeResolve(),
     ]
};
