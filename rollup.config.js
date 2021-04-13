import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        name: 'react-fieldset',
        dir: 'dist/',
        format: 'esm',
      },
    ],

    plugins: [
      peerDepsExternal(),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/react'],
      }),
      terser({
        keep_fnames: true,
      }),
    ],
  },
]
