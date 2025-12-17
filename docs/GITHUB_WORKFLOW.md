# Aegisight: Team Collaboration & GitHub Workflow

This guide ensures the engineering team works effectively on GitHub while maintaining a secure and stable local environment.

## 1. The "Golden Rule" of Safety (Secrets Management)
**Problem:** We rely on `key.json` (Google Cloud) and `.env` (ServiceNow Credentials). These **MUST NEVER** be pushed to GitHub.
**The Solution:**
*   **GitIgnore:** These files are already in `.gitignore`. Do not verify `git add -f` them.
*   **Onboarding New Devs:**
    1.  Clone the repo: `git clone https://github.com/marek-ne/aegisight.git`
    2.  Copy the example env: `cp .env.example .env`
    3.  **Manually** add credentials to `.env` (Ask the Admin via secure chat, e.g., 1Password/LastPass).
    4.  Place the shared `key.json` in the root manually.

## 2. The Branching Strategy (Flow)
We use a **Feature Branch** workflow. Direct commits to `master` are forbidden (except for hotfixes).

### Step-by-Step Workflow:
1.  **Sync First:** Always start by getting the latest changes.
    ```bash
    git checkout master
    git pull origin master
    ```
2.  **Create a Feature Branch:** Name it descriptively (`<type>/<metric-name>`).
    ```bash
    # Good Examples: feature/supply-chain-ingest, fix/servicenow-timeout, docs/update-readme
    git checkout -b feature/new-dashboard-filter
    ```
3.  **Work & Commit:**
    *   Make changes in your local environment.
    *   Test locally (`node server.js`).
    *   Commit often: `git commit -m "Added source filter logic"`
4.  **Push & Review:**
    ```bash
    git push -u origin feature/new-dashboard-filter
    ```
    *   Go to GitHub and create a **Pull Request (PR)**.
    *   Ask a teammate to review.
5.  **Merge:** Once approved, merge the PR on GitHub. The code is now in `master`.

## 3. Safe Updates (Updating Your Local Eval)
When a teammate merges code (e.g., "Bob added the Supply Chain logic"), you need it on your machine without breaking your current work.

```bash
# 1. Save your current unfinished work
git stash

# 2. Get their changes
git checkout master
git pull origin master

# 3. Go back to your branch and merge their updates into yours
git checkout feature/my-current-work
git merge master

# 4. Bring back your unfinished work
git stash pop
```

## 4. Conflict Resolution (The "Panic" Button)
If `git merge` says "CONFLICT", don't panic.
1.  Open the file in VS Code.
2.  Look for `<<<<<<< HEAD` (Your code) and `>>>>>>> master` (Their code).
3.  Choose which one to keep (or combine them).
4.  Save, `git add .`, and `git commit`.

## 5. Deployment
*   **Staging:** When `master` is updated, pull it to the Staging Server.
*   **Production:** We tag releases (e.g., `v1.0.0`) for Production stability.
