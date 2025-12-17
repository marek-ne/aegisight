# Google Tag Manager - Click Tracking Setup Guide

This guide will help you track every important click and user interaction on your Aegisight AI prototype.

---

## Step 1: Enable Built-in Click Variables

Before creating any click tracking, you need to enable the built-in click variables:

1. Go to [Google Tag Manager](https://tagmanager.google.com)
2. Select your **GTM-M8NJXR2D** container
3. Click **"Variables"** (left sidebar)
4. Scroll down to **"Built-In Variables"**
5. Click **"Configure"**
6. Enable these variables:
   - ✅ **Click Element**
   - ✅ **Click Classes**
   - ✅ **Click ID**
   - ✅ **Click Target**
   - ✅ **Click Text**
   - ✅ **Click URL**
7. Click **"Save"**

---

## Step 2: Create Click Triggers

### Trigger 1: All Button Clicks

**Purpose:** Track every button click on your site

1. Go to **"Triggers"** → Click **"New"**
2. **Name:** `All Button Clicks`
3. **Trigger Configuration:**
   - Type: **"Just Links"** → Choose **"All Elements"**
   - This trigger fires on: **"Some Clicks"**
   - Fire this trigger when: `Click Element` matches CSS selector `button`
4. Click **"Save"**

---

### Trigger 2: Navigation Link Clicks

**Purpose:** Track clicks on main navigation items

1. **Name:** `Navigation Clicks`
2. **Trigger Configuration:**
   - Type: **"All Elements"**
   - Fire on: **"Some Clicks"**
   - Condition: `Click Classes` contains `nav-link`
3. Click **"Save"**

---

### Trigger 3: CTA Button Clicks

**Purpose:** Track Contact Us and other CTA buttons

1. **Name:** `CTA Button Clicks`
2. **Trigger Configuration:**
   - Type: **"All Elements"**
   - Fire on: **"Some Clicks"**
   - Condition: `Click Classes` contains `cta-button`
3. Click **"Save"**

---

### Trigger 4: Mega Menu Interactions

**Purpose:** Track which mega menu tabs users click

1. **Name:** `Mega Menu Tab Clicks`
2. **Trigger Configuration:**
   - Type: **"All Elements"**
   - Fire on: **"Some Clicks"**
   - Condition: `Click Classes` contains `mega-menu-item`
3. Click **"Save"**

---

### Trigger 5: Dropdown Trigger

**Purpose:** Track when users open the Capabilities dropdown

1. **Name:** `Dropdown Open`
2. **Trigger Configuration:**
   - Type: **"All Elements"**
   - Fire on: **"Some Clicks"**
   - Condition: `Click Classes` contains `solutions-trigger`
3. Click **"Save"**

---

## Step 3: Create GA4 Event Tags

Now create tags that send click data to Google Analytics.

### Tag 1: Button Click Event

1. Go to **"Tags"** → Click **"New"**
2. **Name:** `GA4 - Button Click`
3. **Tag Configuration:**
   - Type: **"Google Analytics: GA4 Event"**
   - Configuration Tag: **Select "Aegisight Tag"** (your existing GA4 config)
   - Event Name: `button_click`
   - **Event Parameters:**
     - Parameter Name: `button_text` → Value: `{{Click Text}}`
     - Parameter Name: `button_id` → Value: `{{Click ID}}`
     - Parameter Name: `button_classes` → Value: `{{Click Classes}}`
4. **Triggering:** Select **"All Button Clicks"** (trigger you created)
5. Click **"Save"**

---

### Tag 2: Navigation Click Event

1. **Name:** `GA4 - Navigation Click`
2. **Tag Configuration:**
   - Type: **"Google Analytics: GA4 Event"**
   - Configuration Tag: **"Aegisight Tag"**
   - Event Name: `nav_click`
   - **Event Parameters:**
     - `link_text` → `{{Click Text}}`
     - `link_url` → `{{Click URL}}`
3. **Triggering:** **"Navigation Clicks"**
4. Click **"Save"**

---

### Tag 3: CTA Click Event

1. **Name:** `GA4 - CTA Click`
2. **Tag Configuration:**
   - Type: **"Google Analytics: GA4 Event"**
   - Configuration Tag: **"Aegisight Tag"**
   - Event Name: `cta_click`
   - **Event Parameters:**
     - `cta_text` → `{{Click Text}}`
     - `cta_id` → `{{Click ID}}`
3. **Triggering:** **"CTA Button Clicks"**
4. Click **"Save"**

---

### Tag 4: Mega Menu Event

1. **Name:** `GA4 - Mega Menu Tab`
2. **Tag Configuration:**
   - Type: **"Google Analytics: GA4 Event"**
   - Configuration Tag: **"Aegisight Tag"**
   - Event Name: `mega_menu_tab_click`
   - **Event Parameters:**
     - `tab_name` → `{{Click Text}}`
3. **Triggering:** **"Mega Menu Tab Clicks"**
4. Click **"Save"**

---

### Tag 5: Dropdown Event

1. **Name:** `GA4 - Dropdown Open`
2. **Tag Configuration:**
   - Type: **"Google Analytics: GA4 Event"**
   - Configuration Tag: **"Aegisight Tag"**
   - Event Name: `dropdown_open`
3. **Triggering:** **"Dropdown Open"**
4. Click **"Save"**

---

## Step 4: Test Your Setup

### Use GTM Preview Mode:

1. Click **"Preview"** (top right in GTM)
2. Enter: `https://aegisight.ai`
3. Click **"Connect"**
4. In the debug panel, click around your site and watch:
   - **"Tags Fired"** section should show your GA4 event tags firing
   - Check the **"Variables"** tab to see what data is being captured

---

## Step 5: Publish Changes

1. Click **"Submit"** (top right)
2. Version Name: `Added click tracking`
3. Description: `Tracking buttons, navigation, CTA, mega menu, and dropdowns`
4. Click **"Publish"**

---

## Step 6: View Click Data in GA4

After publishing, your click events will appear in GA4:

1. Go to **Google Analytics** → **Reports** → **Realtime**
2. Scroll to **"Event count by Event name"**
3. You should see your custom events:
   - `button_click`
   - `nav_click`
   - `cta_click`
   - `mega_menu_tab_click`
   - `dropdown_open`

### View Historical Data:

After 24-48 hours, go to:
- **Reports** → **Engagement** → **Events**
- You'll see all your custom events with counts and user engagement

---

## Quick Reference: Events You'll Track

| Event Name | What It Tracks | Use Case |
|------------|---------------|----------|
| `button_click` | All button clicks | See which buttons are most popular |
| `nav_click` | Navigation menu clicks | Track which sections users explore |
| `cta_click` | Call-to-action buttons | Measure conversion intent |
| `mega_menu_tab_click` | Mega menu tab switches | See which capabilities interest users |
| `dropdown_open` | Dropdown menu opens | Track menu engagement |

---

## Advanced: Add More Custom Events (Optional)

### Scroll Depth Tracking

1. **Trigger:** Built-in **"Scroll Depth"** trigger
2. Set thresholds: 25%, 50%, 75%, 90%
3. **Tag:** GA4 Event `scroll_depth` with parameter `percent_scrolled`

### Form Submissions (when you add forms later)

1. **Trigger:** Form submission
2. **Tag:** GA4 Event `form_submit` with `form_id` parameter

### Outbound Link Clicks

1. **Trigger:** Click URL does not contain `aegisight.ai`
2. **Tag:** GA4 Event `outbound_click` with `destination_url`

---

## Troubleshooting

### Tags Not Firing?

1. Check GTM Preview mode
2. Verify triggers are configured correctly
3. Make sure you published the container

### No Data in GA4?

1. Wait 5-10 minutes for data to process
2. Check "Realtime" reports first
3. Ensure your GA4 tag is firing (check in Preview mode)

---

## Summary

You now have comprehensive click tracking that will show you:
- ✅ What users click on
- ✅ Which navigation items are popular
- ✅ Which CTA buttons work best
- ✅ How users interact with your mega menu
- ✅ User journey patterns

This data will help you optimize your prototype based on real user behavior!
