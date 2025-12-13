#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building Vite..."
npm exec vite build

echo "Building server..."
npm exec esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete!"
