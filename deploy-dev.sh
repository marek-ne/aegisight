#!/bin/bash
echo "Starting deployment to DEV (dev.aegisight.ai)..."

TARGET_DIR="/var/www/dev.aegisight.ai"

# Ensure target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating directory $TARGET_DIR..."
    mkdir -p "$TARGET_DIR"
fi

# Copy Files
echo "Copying application files..."
cp package.json "$TARGET_DIR/"
cp server.js "$TARGET_DIR/"
cp -r views "$TARGET_DIR/"
cp -r public "$TARGET_DIR/"
cp -r config "$TARGET_DIR/"
cp -r routes "$TARGET_DIR/"
cp -r middleware "$TARGET_DIR/"
cp -r models "$TARGET_DIR/"
cp -r scripts "$TARGET_DIR/"
cp -r src "$TARGET_DIR/"
cp -r data "$TARGET_DIR/"
cp .env "$TARGET_DIR/"
cp key.json "$TARGET_DIR/"

# Install Dependencies
echo "Installing dependencies in $TARGET_DIR..."
cd "$TARGET_DIR"
npm install --production

# PM2 Management
echo "Managing PM2 process..."
if pm2 list | grep -q "dev.aegisight.ai"; then
    echo "Reloading existing process..."
    pm2 reload dev.aegisight.ai
else
    echo "Starting new process on Port 3002..."
    PORT=3002 pm2 start server.js --name "dev.aegisight.ai"
fi

echo "Saving PM2 list..."
pm2 save

echo "Deployment Complete! DEV App should be running on Port 3002."
