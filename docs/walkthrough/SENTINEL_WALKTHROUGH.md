# Sentinel Integration Walkthrough

The Sentinel onboarding workflow has been successfully integrated into the Aegisight platform.

## Changes Made
- **Sentinel App**: Built the React application from `src/sentinel` with `base: '/onboarding/'`.
- **Deployment**: Deployed built assets to `public/onboarding`.
- **Server**: Updated `server.js` to serve the app at `/onboarding`.

## Verification Steps

### 1. Restart Server
> [!IMPORTANT]
> **CRITICAL STEP**: You **MUST** stop and restart your Express server (e.g., `Ctrl+C` then `node server.js`) for the permissions update to take effect. Refreshing the browser is NOT enough.
```bash
# If configured with nodemon
rs

# Or manually
node server.js
```

### 2. Access Onboarding
Navigate to: `http://localhost:3006/onboarding`
(Replace `3006` with your configured port if different)

### 3. Verify Workflow
- **Calibration**: Check if you can select an Asset Class and adjust Historical Depth.
- **Analysis**: Ensure the "Processing Engine" animation runs.
- **Report**: Verify the Risk Register table is populated.

### 4. Demo Mode Active
The application is now configured with a **Standalone Demo Mode**.
- **No API Key Required**: If no key is present, it will simulate the AI analysis with realistic mock data.
- **Resilient**: Even if the network fails or API quota is exceeded, the demo will not break.
- **Source Location**: The source code is now located in `src/sentinel`.

To invoke the live AI, you can still add a valid key to `.env.local` and rebuild, but it is no longer mandatory for the walkthrough.
