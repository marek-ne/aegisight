#!/bin/bash
echo "Starting deployment to Production (aegisight.ai)..."

TARGET_DIR="/var/www/aegisight.ai"
BACKUP_DIR="/var/www/aegisight.ai.bak"

# Ensure target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating directory $TARGET_DIR..."
    mkdir -p "$TARGET_DIR"
fi

# Backup
if [ -d "$TARGET_DIR" ]; then
    echo "Backing up $TARGET_DIR to $BACKUP_DIR..."
    rm -rf "$BACKUP_DIR"
    cp -r "$TARGET_DIR" "$BACKUP_DIR"
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
if pm2 list | grep -q "aegisight.ai"; then
    echo "Reloading existing process..."
    pm2 reload aegisight.ai
else
    echo "Starting new process on Port 3003..."
    PORT=3003 pm2 start server.js --name "aegisight.ai"
fi

echo "Saving PM2 list..."
pm2 save

echo "Deployment Complete! App should be running on Port 3003."

