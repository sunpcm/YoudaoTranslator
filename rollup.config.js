import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import { uglify } from 'rollup-plugin-uglify'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'

export default {
  input: ['src/index.ts', 'src/add_word.ts'],
  output: {
    dir: 'dist',
    format: 'es'
  },
  
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      compilerOptions: { outDir: "dist" }
    }),
    copy({targets: [
      { src: 'runtime/*', dest: 'dist/runtime' },
      { src: 'assets/*', dest: 'dist/assets' }
    ]}),
    nodeResolve(),
    commonjs(),
    json(),
    uglify()
  ]
}