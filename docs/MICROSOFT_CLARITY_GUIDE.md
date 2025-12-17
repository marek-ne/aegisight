# Microsoft Clarity Setup Guide - Session Recording & Heatmaps

Microsoft Clarity provides **session recordings** and **heatmaps** to see exactly how users interact with your site, including:
- 🎥 **Session Recordings** - Watch real user sessions like a video
- 🖱️ **Mouse Movements** - See where users hover and move their cursor
- 🔥 **Heatmaps** - Visualize click patterns and scroll depth
- 📊 **Rage Clicks** - Identify frustrating UI elements
- ⏱️ **Dead Clicks** - Find broken or unresponsive areas

---

## Step 1: Create a Clarity Account

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
2. Click **"Sign in for free"**
3. Use your **Microsoft account** (or create one)
4. Click **"Add new project"**

---

## Step 2: Set Up Your Project

1. **Project name:** `Aegisight AI - Prototype`
2. **Website URL:** `https://aegisight.ai`
3. **Site category:** `Business Software`
4. Click **"Add new project"**

---

## Step 3: Get Your Clarity Project ID

After creating the project, you'll see an **installation screen**.

1. Look for the **"Project ID"** - it looks like: `abc123def456`
2. **Copy this ID** - you'll need it for GTM

---

## Step 4: Add Clarity to Google Tag Manager

### Option A: Use the Official Clarity Tag Template (Recommended)

1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Click **"Tags"** → **"New"**
3. **Name:** `Microsoft Clarity - Official`
4. **Tag Configuration:**
   - Click **"Discover more tag types in the Community Template Gallery"**
   - Search for **"Microsoft Clarity"**
   - Click **"Microsoft Clarity"** by Microsoft
   - Click **"Add to workspace"**
5. Enter your **Clarity Project ID**: `[paste your ID here]`
6. **Triggering:** Select **"All Pages"**
7. Click **"Save"**

### Option B: Manual Installation (Alternative)

If you prefer to add Clarity manually:

1. In GTM, click **"Tags"** → **"New"**
2. **Name:** `Microsoft Clarity`
3. **Tag Configuration:**
   - Type: **"Custom HTML"**
   - Paste this code (replace `YOUR_PROJECT_ID`):

```html
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
</script>
```

4. **Triggering:** **"All Pages"**
5. Click **"Save"**

---

## Step 5: Publish GTM Changes

1. Click **"Submit"** (top right in GTM)
2. Version name: `Added Microsoft Clarity`
3. Click **"Publish"**

---

## Step 6: Verify Clarity is Working

### Quick Test:

1. **Wait 2-3 minutes** after publishing
2. Go to [clarity.microsoft.com](https://clarity.microsoft.com)
3. Open your project
4. You should see a **green "Active"** status
5. Open a new tab → visit `https://aegisight.ai`
6. Browse around for 1-2 minutes
7. Go back to Clarity dashboard
8. Click **"Recordings"** → You should see your session appear!

---

## Step 7: Understanding Clarity Data

### Session Recordings

**What:** Watch recordings of real user sessions

**How to Access:**
1. Clarity Dashboard → **"Recordings"**
2. Click any session to watch it

**What You'll See:**
- 🖱️ Mouse movements and hovers
- 🖱️ Clicks and interactions
- 📜 Scrolling behavior
- ⏱️ Time spent on each section
- 📱 Device and browser info

**Filters Available:**
- Filter by **"Rage clicks"** (users clicking repeatedly in frustration)
- Filter by **"Dead clicks"** (clicks on non-interactive elements)
- Filter by **"Excessive scrolling"** (users struggling to find content)
- Filter by **session duration**, device type, country

---

### Heatmaps

**What:** Visual representation of where users click and scroll

**How to Access:**
1. Clarity Dashboard → **"Heatmaps"**
2. Select a page URL

**Three Types:**
1. **Click Heatmap** - Shows where users click most
2. **Scroll Heatmap** - Shows how far users scroll
3. **Area Heatmap** - Shows which sections get most attention

**Use Cases:**
- See if users are finding your CTA buttons
- Check if they scroll to your product features
- Identify which mega menu tabs get most clicks

---

### Dashboard Metrics

**What:** Overview of site performance

**Key Metrics:**
- **Sessions:** Total number of visits
- **Clarity Score:** 0-100 rating (higher = better UX)
- **Rage Clicks:** Number of frustrated clicks
- **Dead Clicks:** Clicks on non-clickable elements
- **Excessive Scrolling:** Users searching for content
- **Quick Backs:** Users leaving immediately

---

## Step 8: Key Features for Prototype Testing

### 1. Watch Real User Journeys

**Goal:** See how users navigate your prototype

**What to Look For:**
- Do they open the **mega menu**?
- Which **tabs** do they hover over?
- Do they click **"Contact Us"**?
- Where do they **get stuck**?

---

### 2. Identify Hover Patterns

**Goal:** See what elements attract attention

**What to Check:**
- Do users hover over menu items before clicking?
- Are they reading your feature descriptions?
- Do they hover over the Bento Box tiles?

---

### 3. Find UX Issues

**Goal:** Discover frustrating elements

**Red Flags:**
- **Rage clicks** on buttons that don't work
- **Dead clicks** on text they think is clickable
- **Excessive scrolling** = can't find what they need
- **Quick backs** = confusing landing page

---

### 4. Track Mobile vs Desktop Behavior

**Goal:** See how experience differs by device

**Filters:**
- Desktop vs Mobile
- Browser type
- Screen resolution

---

## Step 9: Weekly Review Checklist

Use Clarity data to improve your prototype:

### Every Week, Check:

1. **New Recordings** (watch 5-10 recent sessions)
   - What do users click first?
   - Do they explore the mega menu?
   - Where do they spend most time?

2. **Heatmaps** (review for each major page section)
   - Are CTA buttons getting clicks?
   - Are users scrolling to your features?
   - Which navigation items are popular?

3. **Dashboard Alerts**
   - High rage clicks? Fix that button/element
   - High dead clicks? Make that text non-clickable looking
   - High bounce rate? Improve landing page

---

## Integration with GA4

**Best Practice:** Use Clarity + GA4 together:

- **GA4** tells you **WHAT** users do (quantitative)
  - How many clicked the button?
  - How long did they stay?
  - Which page gets most traffic?

- **Clarity** shows you **WHY** they do it (qualitative)
  - Why did they leave?
  - Why didn't they click the CTA?
  - What confused them?

**Example Workflow:**
1. GA4 shows "70% of users leave from the homepage"
2. Clarity recordings reveal "users can't find the pricing info"
3. **Fix:** Add a clear pricing section or CTA

---

## Privacy & GDPR Compliance

**Good News:** Clarity is privacy-friendly:
- ✅ No cookies required
- ✅ Automatically masks sensitive data
- ✅ Compliant with GDPR, CCPA
- ✅ Free forever (no hidden costs)

**What's Auto-Masked:**
- Credit card numbers
- Email addresses
- Phone numbers
- Passwords

**Your Cookie Banner Still Works** - Users can still reject analytics if needed.

---

## Tips for Prototype Testing

### 1. Share Your Link

Get real user feedback:
- Share `https://aegisight.ai` with colleagues
- Post on LinkedIn: "Testing my new AI product - feedback welcome!"
- Send to potential customers

### 2. Watch First 10 Sessions Carefully

The first users reveal the most UX issues:
- Are they confused by navigation?
- Do they understand your value proposition?
- What do they click on first?

### 3. Look for Patterns

After 20-30 sessions, look for trends:
- Do 80% of users click the same menu item?
- Are most users scrolling to the bottom?
- Are they ignoring your CTA?

### 4. Iterate Fast

Prototype is for learning:
- See a problem → Fix it immediately
- Test again → Watch new sessions
- Repeat until smooth experience

---

## Troubleshooting

### No Data Showing?

1. **Check GTM Preview** - Verify Clarity tag is firing
2. **Wait 5-10 minutes** - Data takes a few minutes to process
3. **Check Project Status** - Should show "Active" in Clarity dashboard
4. **Clear Browser Cache** - Hard refresh your site

### Clarity Not Recording My Session?

- **Use Incognito mode** (extensions can block tracking)
- **Disable ad blockers** temporarily
- **Check CSP** - Make sure `*.clarity.ms` is allowed (already done!)

### Can't Find Specific Session?

Use filters:
- Filter by **date/time**
- Filter by **page URL**
- Search by **session ID**

---

## Summary: What You Get with Clarity

✅ **Session Recordings** - Watch real user behavior  
✅ **Heatmaps** - See click and scroll patterns  
✅ **Hover Tracking** - Monitor mouse movements  
✅ **Rage Click Detection** - Find frustrating elements  
✅ **Mobile & Desktop Views** - Compare experiences  
✅ **Free Forever** - No cost, unlimited sessions  

**Perfect for prototypes** - See exactly how users interact with your MVP!

---

## Next Steps

1. ✅ Create Clarity account → Get Project ID
2. ✅ Add Clarity tag in GTM → Use template or custom HTML
3. ✅ Publish GTM changes
4. ✅ Wait 5 minutes → Check Clarity dashboard
5. ✅ Browse your site → Watch your first recording!

Once set up, you'll have **visual proof** of how users interact with every element on your site! 🎯
