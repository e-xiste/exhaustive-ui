import { defineConfig } from 'tsdown';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    fixedExtension: true,
    dts: true,
    // Keep the published bundle readable: it is a CLI whose stack traces users may have to report.
    minify: false,
    sourcemap: isProduction,
    clean: isProduction
});
