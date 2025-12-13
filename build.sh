#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building Vite..."
./node_modules/.bin/vite build

echo "Building server..."
./node_modules/.bin/esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete!"
