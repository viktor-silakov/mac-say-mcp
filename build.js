#!/usr/bin/env node

import * as esbuild from 'esbuild';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const buildConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: 'dist/index.js',
  external: ['@modelcontextprotocol/sdk'],
  banner: {
    js: '#!/usr/bin/env node'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  sourcemap: process.env.NODE_ENV !== 'production',
  minify: process.env.NODE_ENV === 'production'
};

async function build() {
  try {
    const result = await esbuild.build(buildConfig);
    console.log('✅ Build completed successfully');
    
    if (result.warnings.length > 0) {
      console.warn('⚠️  Build warnings:');
      result.warnings.forEach(warning => console.warn(warning));
    }
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function watch() {
  try {
    const ctx = await esbuild.context(buildConfig);
    await ctx.watch();
    console.log('👀 Watching for changes...');
  } catch (error) {
    console.error('❌ Watch failed:', error);
    process.exit(1);
  }
}

// Check if this script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === 'watch') {
    watch();
  } else {
    build();
  }
}

export { buildConfig, build, watch };