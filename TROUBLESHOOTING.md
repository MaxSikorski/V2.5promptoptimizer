# Troubleshooting Guide - Prompt Optimizer V2

## Quick Diagnostics

### Step 1: Open Browser Console

1. **Chrome/Edge:** Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. **Firefox:** Press `F12` or `Ctrl+Shift+K`
3. **Safari:** Enable Developer Menu: Preferences → Advanced → "Show Develop menu", then `Cmd+Option+C`

### Step 2: Look for Errors

Check the Console tab for:
- ❌ Red error messages
- ⚠️ Yellow warning messages
- 🔵 Blue info messages (our debug logs)

### Step 3: Run Manual Diagnostic

Type this in the console:
```javascript
debugPromptOptimizer()
```

This will show you exactly what's working and what's not.

---

## Common Issues & Fixes

### Issue 1: "Nothing happens when I type"

**Symptoms:**
- Type in the textarea
- Token counter stays at "0 tokens"
- Score doesn't update
- Next button stays disabled

**Cause:** JavaScript not loading or not executing

**Fix:**

1. **Check files are uploaded:**
   - Go to your GitHub repo
   - Verify these files exist in the root (or same folder as index.html):
     - `index.html`
     - `styles.css`
     - `app.js`
     - `analyzer.js`
     - `optimizer.js`
     - `models.js`
     - `debug.js` (if you added it)

2. **Check browser console for 404 errors:**
   ```
   Failed to load resource: net::ERR_FILE_NOT_FOUND
   ```
   If you see this, files are in wrong location or names don't match.

3. **Check for JavaScript errors:**
   ```
   Uncaught ReferenceError: PromptAnalyzer is not defined
   ```
   This means scripts aren't loading in correct order.

**Solution:**

Update your `index.html` to load scripts in correct order with error handling:

```html
<!-- At the end of <body>, BEFORE closing </body> tag: -->

<!-- Debug script (optional but recommended) -->
<script src="debug.js" onerror="alert('Failed to load debug.js')"></script>

<!-- Core dependencies FIRST -->
<script src="models.js" onerror="alert('Failed to load models.js')"></script>
<script src="analyzer.js" onerror="alert('Failed to load analyzer.js')"></script>
<script src="optimizer.js" onerror="alert('Failed to load optimizer.js')"></script>

<!-- Main app LAST -->
<script src="app.js" onerror="alert('Failed to load app.js')"></script>

<!-- Verify loading -->
<script>
console.log('All scripts should be loaded now');
</script>
</body>
```

---

### Issue 2: "Icons not showing"

**Symptoms:**
- You see `[icon]` or empty spaces where icons should be
- Theme toggle, info button have no icons

**Cause:** Lucide Icons CDN not loading or not initializing

**Fix:**

1. **Check CDN is in `<head>`:**
```html
<script src="https://unpkg.com/lucide@0.400.0/dist/umd/lucide.min.js"></script>
```

2. **Check console for CDN errors:**
```
Failed to load resource: https://unpkg.com/lucide@0.400.0/dist/umd/lucide.min.js
```

3. **If CDN is blocked, use fallback:**
   - Download lucide.min.js from https://github.com/lucide-icons/lucide
   - Add to your repo
   - Change script src to `./lucide.min.js`

4. **Verify initialization:**
```javascript
// In console:
typeof lucide
// Should return: "object"

lucide.createIcons()
// Should render icons
```

---

### Issue 3: "Page looks broken / No styling"

**Symptoms:**
- Page has no colors
- Everything is left-aligned
- Looks like plain HTML

**Cause:** CSS not loading

**Fix:**

1. **Check link in `<head>`:**
```html
<link rel="stylesheet" href="styles.css">
```

2. **Verify CSS file exists:**
   - Check GitHub repo
   - File should be named exactly `styles.css` (case-sensitive on some servers)

3. **Check for 404 in Network tab:**
   - Open DevTools → Network tab
   - Reload page
   - Look for `styles.css` with status 404

4. **Try absolute path:**
```html
<link rel="stylesheet" href="./styles.css">
```

---

### Issue 4: "Next button never enables"

**Symptoms:**
- Type in prompt
- Analysis works (score updates)
- But "Next Step" button stays grayed out

**Cause:** Button not being enabled in code

**Fix:**

1. **Check console for:** `✓ UI updated, next button enabled`
   - If missing, JavaScript has an error

2. **Manually enable in console:**
```javascript
document.getElementById('next-btn').disabled = false;
```

3. **If that works, the issue is in app.js**
   - Check `analyzePrompt()` function
   - Ensure it ends with: `nextBtn.disabled = false;`

---

### Issue 5: "Optimization produces no output"

**Symptoms:**
- Get to Step 4 (Results)
- Original prompt shows
- Optimized prompt is blank
- Or page hangs/freezes

**Cause:** Optimizer not running or crashing

**Fix:**

1. **Check console during optimization:**
   - Should see: "Performing optimization..."
   - Then: "Optimization complete"

2. **Test optimizer manually:**
```javascript
// In console:
const testAnalysis = PromptAnalyzer.analyze("test prompt", "claude");
const result = PromptOptimizer.optimize("test prompt", testAnalysis, "claude", "standard", {});
console.log('Result:', result);
```

3. **If you see an error:**
   - Note the error message
   - Check optimizer.js for syntax errors
   - Common issue: Missing bracket or comma

---

### Issue 6: "Saved prompts don't persist"

**Symptoms:**
- Save prompt to library
- Reload page
- Library is empty

**Cause:** LocalStorage not working

**Fix:**

1. **Check if localStorage is available:**
```javascript
// In console:
typeof localStorage
// Should return: "object"
```

2. **Check if it's being blocked:**
   - Private/Incognito mode blocks localStorage
   - Some browsers block it by default
   - Check Settings → Privacy

3. **Test manually:**
```javascript
localStorage.setItem('test', 'hello');
localStorage.getItem('test');
// Should return: "hello"
```

4. **If still blocked:**
   - Use normal browser window (not private)
   - Check site permissions
   - Try different browser

---

### Issue 7: "GitHub Pages shows old version"

**Symptoms:**
- Updated files in repo
- Pushed to GitHub
- Site still shows old version

**Cause:** GitHub Pages caching or not deployed

**Fix:**

1. **Wait 1-5 minutes:**
   - GitHub Pages takes time to rebuild
   - Check Actions tab for deployment status

2. **Hard refresh:**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5`
   - Safari: `Cmd+Option+R`

3. **Clear browser cache:**
   - Settings → Privacy → Clear browsing data
   - Select "Cached images and files"

4. **Check deployment:**
   - Go to repo → Settings → Pages
   - Should show: "Your site is live at..."
   - Click "Visit site" (not bookmark)

5. **Force rebuild:**
   - Make a small change (add a space to README)
   - Commit and push
   - Wait for new deployment

---

## Advanced Debugging

### Enable Verbose Logging

Add this to the top of `app.js` (after dependency check):

```javascript
// Global debug flag
window.DEBUG = true;

// Enhanced logging
const log = {
    info: (...args) => window.DEBUG && console.log('ℹ️', ...args),
    success: (...args) => window.DEBUG && console.log('✓', ...args),
    warn: (...args) => window.DEBUG && console.warn('⚠️', ...args),
    error: (...args) => window.DEBUG && console.error('❌', ...args),
    group: (label) => window.DEBUG && console.group(label),
    groupEnd: () => window.DEBUG && console.groupEnd()
};

// Replace console.log calls with log.info, etc.
```

### Test Individual Components

```javascript
// Test Analyzer
const testPrompt = "Make me a simple webpage for my marketing company. I want it to look really good.";
console.log('Testing Analyzer...');
const analysis = PromptAnalyzer.analyze(testPrompt, 'claude');
console.log('Analysis:', analysis);
console.log('Score:', analysis.overallScore.score);
console.log('Components:', analysis.components.presentCount, '/ 10');

// Test Optimizer
console.log('Testing Optimizer...');
const optimized = PromptOptimizer.optimize(testPrompt, analysis, 'claude', 'standard', {});
console.log('Optimized:', optimized);
console.log('Original length:', testPrompt.length);
console.log('Optimized length:', optimized.optimized.length);
console.log('Techniques applied:', optimized.techniques.length);

// Test UI Update
console.log('Testing UI Update...');
const scoreElement = document.getElementById('score-value');
scoreElement.textContent = analysis.overallScore.score.toFixed(1);
console.log('Score element updated:', scoreElement.textContent);
```

### Check File Integrity

Verify files are complete and not corrupted:

```javascript
// In console:
fetch('analyzer.js')
    .then(r => r.text())
    .then(text => {
        console.log('analyzer.js size:', text.length, 'characters');
        console.log('Contains PromptAnalyzer:', text.includes('PromptAnalyzer'));
    });

fetch('optimizer.js')
    .then(r => r.text())
    .then(text => {
        console.log('optimizer.js size:', text.length, 'characters');
        console.log('Contains PromptOptimizer:', text.includes('PromptOptimizer'));
    });
```

Expected sizes:
- `analyzer.js`: ~20,000 characters
- `optimizer.js`: ~16,000 characters
- `app.js`: ~26,000 characters
- `models.js`: ~2,500 characters

---

## Still Not Working?

### Create a Minimal Test Page

Create `test.html` in your repo:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Minimal Test</title>
</head>
<body>
    <h1>Prompt Optimizer Test</h1>
    <textarea id="test-input" rows="5" cols="50" placeholder="Type here..."></textarea>
    <div id="result"></div>

    <script src="models.js"></script>
    <script src="analyzer.js"></script>
    <script src="optimizer.js"></script>
    <script>
        console.log('Test page loaded');
        console.log('PromptAnalyzer:', typeof PromptAnalyzer);
        console.log('PromptOptimizer:', typeof PromptOptimizer);
        
        const input = document.getElementById('test-input');
        const result = document.getElementById('result');
        
        input.addEventListener('input', (e) => {
            console.log('Input:', e.target.value);
            
            if (e.target.value.length > 5) {
                const analysis = PromptAnalyzer.analyze(e.target.value, 'claude');
                result.innerHTML = `
                    <p>Score: ${analysis.overallScore.score}/10</p>
                    <p>Tokens: ${analysis.tokenCount}</p>
                    <p>Components: ${analysis.components.presentCount}/10</p>
                `;
            }
        });
        
        console.log('Test setup complete - type in the textarea');
    </script>
</body>
</html>
```

If this works but main app doesn't, the issue is in the main HTML/CSS/app.js integration.

---

## Getting Help

If none of these fixes work:

1. **Collect information:**
   - Browser and version
   - Operating system
   - Console errors (screenshot)
   - Network tab errors (screenshot)
   - What you tried from this guide

2. **Open GitHub Issue:**
   - Go to repo → Issues → New Issue
   - Title: "Bug: [Brief description]"
   - Include all collected information

3. **Share your repo:**
   - Make it public temporarily
   - Include link in issue
   - This helps diagnose deployment issues

---

## Prevention Checklist

Before deploying:

- [ ] All 6 JS files committed and pushed
- [ ] Files are in correct location (root or same folder)
- [ ] File names are exact (case-sensitive)
- [ ] GitHub Pages is enabled in Settings
- [ ] Wait 1-5 minutes after push
- [ ] Test in incognito/private window (clears cache)
- [ ] Check browser console for errors
- [ ] Verify Lucide CDN loads
- [ ] Test the debug.js diagnostic script

---

**Last Updated:** January 29, 2026
