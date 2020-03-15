import pkg from './package.json';
// @ts-check
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import builtinModules from 'builtin-modules';
import babelModernConfig from './.babelrc.modern.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const nodeResolvePlugin = resolve({ extensions, preferBuiltins: true });

/**
 * @type {ReadonlyArray<import('rollup').RollupOptions>}
 */
const config = [
  {
    input: 'src/library/parser.ts',
    output: [
      {
        file: pkg.exports['.'].import,
        format: 'esm',
        sourcemap: true,
        sourcemapExcludeSources: true,
      },
      {
        file: pkg.exports['.'].require,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        sourcemapExcludeSources: true,
      },
    ],
    plugins: [
      nodeResolvePlugin,
      babel({
        extensions,
        babelrc: false,
        configFile: false,
        ...babelModernConfig,
      }),
    ],
    external: builtinModules,
  },
  {
    input: 'src/library/parser.ts',
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: pkg.name,
        exports: 'named',
        sourcemap: true,
        sourcemapExcludeSources: true,
      },
    ],
    plugins: [nodeResolvePlugin, babel({ extensions }), builtins()],
  },
];

export default config;
