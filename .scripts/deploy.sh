#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin master
echo "New changes copied to server !"

# Install dependencies
echo "📦 Installing Dependencies..."
npm install --yes

# Create production build
echo "Creating Production Build..."
npm run build

echo "Deployment Finished!"
