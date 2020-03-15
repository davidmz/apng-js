import pkg from './package.json';
// @ts-check
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import builtinModules from 'builtin-modules';

/**
 * @type {ReadonlyArray<import('rollup').RollupOptions>}
 */
const config = [
  {
    input: 'src/library/parser.js',
    output: [
      {
        file: pkg.exports['.'].import,
        format: 'esm',
      },
      {
        file: pkg.exports['.'].require,
        format: 'cjs',
        exports: 'named',
      },
    ],
    plugins: [babel()],
    external: builtinModules,
  },
  {
    input: 'src/library/parser.js',
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: pkg.name,
        exports: 'named',
      },
    ],
    plugins: [babel(), builtins()],
  },
];

export default config;
