# Apache Configuration for Your Specific Files

Based on your folder structure, you have separate files for production and staging. Here is exactly what goes in each file.

## 1. Production Site (`aegisight.ai.conf`)
**Goal:** Point `aegisight.ai` to **Port 3003**.

Edit this file:
`sudo nano /etc/apache2/sites-available/aegisight.ai.conf`

**Content:**
```apache
<VirtualHost *:80>
    ServerName aegisight.ai
    ServerAlias www.aegisight.ai

    ProxyPreserveHost On
    ProxyPass / http://localhost:3003/
    ProxyPassReverse / http://localhost:3003/
</VirtualHost>

<VirtualHost *:443>
    ServerName aegisight.ai
    ServerAlias www.aegisight.ai

    # SSL Configuration (Ensure paths match your actual certs)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/aegisight.ai/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/aegisight.ai/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://localhost:3003/
    ProxyPassReverse / http://localhost:3003/
</VirtualHost>
```

---

## 2. Staging Site (`dev-aegisight.ai.conf`)
**Goal:** Point `dev.aegisight.ai` to **Port 3002**.

Edit this file:
`sudo nano /etc/apache2/sites-available/dev-aegisight.ai.conf`

**Content:**
```apache
<VirtualHost *:80>
    ServerName dev.aegisight.ai

    ProxyPreserveHost On
    ProxyPass / http://localhost:3002/
    ProxyPassReverse / http://localhost:3002/
</VirtualHost>

<VirtualHost *:443>
    ServerName dev.aegisight.ai

    # SSL Configuration (Ensure paths match your actual certs)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/aegisight.ai/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/aegisight.ai/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://localhost:3002/
    ProxyPassReverse / http://localhost:3002/
</VirtualHost>
```

---

## 3. Enable & Restart
Run these commands to enable the sites (if not already enabled) and restart Apache:

```bash
sudo a2ensite aegisight.ai.conf
sudo a2ensite dev-aegisight.ai.conf
sudo systemctl restart apache2
```
