#!/bin/bash
# Build script for Vercel deployment

echo "Building frontend..."
cd frontend
npm install
npm run build
echo "Frontend build completed!"