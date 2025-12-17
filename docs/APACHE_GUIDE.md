# Apache Configuration Guide

Since you are using Apache, we need to update the configuration to forward traffic from `aegisight.ai` to your running Node.js application on **Port 3003**.

## Steps to Configure Apache

Please execute the following commands in your terminal:

### 1. Enable Proxy Modules
Ensure Apache's proxy modules are enabled.

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl restart apache2
```

### 2. Update VirtualHost Configuration
You need to edit `/etc/apache2/sites-available/aegisight.ai.conf`.

Run this command to edit the file:
```bash
sudo nano /etc/apache2/sites-available/aegisight.ai.conf
```

**Replace the content of the `<VirtualHost *:443>` block with the following:**

```apache
<VirtualHost *:443>
    ServerName aegisight.ai
    ServerAlias www.aegisight.ai
    
    # Proxy to Node.js App on Port 3003
    ProxyPreserveHost On
    ProxyPass / http://localhost:3003/
    ProxyPassReverse / http://localhost:3003/

    # --- SSL Configuration (Keep existing) ---
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/fimpo.net/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/fimpo.net/privkey.pem
    # -----------------------------------------

    # Log files
    ErrorLog ${APACHE_LOG_DIR}/aegisight.ai-error.log
    CustomLog ${APACHE_LOG_DIR}/aegisight.ai-access.log combined
</VirtualHost>
```

### 3. Restart Apache
Apply the changes.

```bash
