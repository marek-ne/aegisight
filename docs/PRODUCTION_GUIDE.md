# Production Deployment Guide

You requested to move the development site (`/var/www/aegisight.a`) to production (`aegisight.ai`).
I have prepared the `deploy.sh` script to handle this, but I encountered **Permission Denied** errors when trying to write to the `/var/www/aegisight.ai` directory.

## Steps to Deploy

Please execute the following commands in your terminal to complete the deployment:

### 1. Fix Permissions
Give your current user ownership of the production directory so the deployment script can write to it.

```bash
sudo mkdir -p /var/www/aegisight.ai
sudo chown -R $(whoami):$(whoami) /var/www/aegisight.ai
```

### 2. Run Deployment Script
Now that you have permissions, run the script I prepared. It will:
- Backup the existing production folder.
- Copy the Node.js application files (server.js, package.json, views, public).
- Install production dependencies (`npm install --production`).
- Start or Reload the application using PM2 on **Port 3003**.

```bash
cd /var/www/aegisight.a
bash deploy.sh
```

### 3. Configure Nginx (If needed)
If you are using Nginx as a reverse proxy, ensure your configuration for `aegisight.ai` points to the running Node.js app on Port 3003.

Example Nginx Config (`/etc/nginx/sites-available/aegisight.ai`):
```nginx
server {
    listen 80;
    server_name aegisight.ai www.aegisight.ai;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Verify Deployment
Check if the application is running:

```bash
pm2 list
curl http://localhost:3003
```

## Summary of Changes Made
- **`server.js`**: Updated to support `process.env.PORT`, allowing it to run on different ports (Dev: 3002, Prod: 3003).
- **`deploy.sh`**: Rewritten to deploy a full Node.js application instead of just static files.
- **`views/index.html`**: Updated with new menu items (Industries, About Us, Blogs, Client Login).
