# Gmail SMTP Setup Guide for Aegisight AI Contact Form

This guide will help you configure Gmail SMTP to enable email sending from the contact form.

## Step 1: Enable 2-Step Verification (if not already enabled)

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** in the left sidebar
3. Under "How you sign in to Google," select **2-Step Verification**
4. Follow the prompts to turn it on

## Step 2: Generate App-Specific Password

Since you're using 2-Step Verification, you need to create an App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords** (at the bottom)
4. Click **App passwords**
5. Select "Mail" as the app and "Other" as the device
6. Enter "Aegisight Contact Form" as the device name
7. Click **Generate**
8. **Copy the 16-character password** shown (you won't see it again)

## Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file:
   ```bash
   nano .env
   ```

3. Update with your Gmail credentials:
   ```env
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=sales@aegisight.ai
   SMTP_PASS=your-16-character-app-password

   # Server Configuration
   PORT=3003
   ```

4. Save the file (Ctrl+X, then Y, then Enter in nano)

## Step 4: Secure the .env File

Make sure `.env` is in your `.gitignore` file (it should already be):

```bash
echo ".env" >> .gitignore
```

## Step 5: Restart the Application

Reload the PM2 process to apply the new environment variables:

```bash
pm2 restart aegisight.ai --update-env
```

Or if deploying:

```bash
./deploy.sh
```

## Step 6: Test the Contact Form

1. Visit https://aegisight.ai/contact
2. Fill out the form with test data
3. Submit the form
4. Check the inbox at sales@aegisight.ai for the test email

## Troubleshooting

### "Invalid login" Error
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Ensure the username is the full email address

### "Connection timeout" Error
- Check that port 587 is not blocked by your firewall
- Try using port 465 with `secure: true` in the SMTP config

### Emails Not Arriving
- Check the spam folder
- Verify the email address in sales@aegisight.ai is correct
- Check PM2 logs: `pm2 logs aegisight.ai`

## Security Notes

- **Never commit the .env file** to version control
- Keep your App Password secure
- Consider using a dedicated email account for form submissions
- Regularly rotate your App Passwords

## Alternative: Using Gmail Alias

If you want to send from a different "From" address but use Gmail SMTP:

1. In Gmail, go to Settings → Accounts and Import
2. Under "Send mail as," add your custom address (e.g., noreply@aegisight.ai)
3. Verify the address through the confirmation email
4. Update the "from" field in server.js to use this address

## Support

For issues with Gmail SMTP, refer to:
- [Google App Passwords Help](https://support.google.com/accounts/answer/185833)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)

Contact your system administrator if you continue to experience issues.
