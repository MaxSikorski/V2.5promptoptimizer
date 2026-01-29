/**
 * DEBUG SCRIPT - Add this to index.html for diagnostics
 * Place BEFORE app.js
 */

(function() {
    console.log('%c=== PROMPT OPTIMIZER V2 DEBUG ===', 'color: #6366f1; font-size: 16px; font-weight: bold');
    
    // 1. Check DOM State
    console.log('DOM State:', document.readyState);
    
    // 2. Check Scripts Loaded
    const checkScripts = () => {
        const scripts = {
            'PromptAnalyzer': typeof window.PromptAnalyzer,
            'PromptOptimizer': typeof window.PromptOptimizer,
            'ModelData': typeof window.ModelData,
            'TooltipContent': typeof window.TooltipContent,
            'lucide': typeof window.lucide
        };
        
        console.log('Script Loading Status:');
        for (const [name, type] of Object.entries(scripts)) {
            const status = type !== 'undefined' ? '✓' : '✗';
            const color = type !== 'undefined' ? 'green' : 'red';
            console.log(`%c${status} ${name}: ${type}`, `color: ${color}`);
        }
        
        const allLoaded = Object.values(scripts).every(t => t !== 'undefined');
        if (!allLoaded) {
            console.error('%cNot all scripts loaded!', 'color: red; font-weight: bold');
            console.error('Fix: Check that all .js files are in the same directory as index.html');
            console.error('Check: Browser console for 404 errors');
        } else {
            console.log('%c✓ All scripts loaded successfully', 'color: green; font-weight: bold');
        }
        
        return allLoaded;
    };
    
    // 3. Check DOM Elements
    const checkElements = () => {
        const requiredIds = [
            'initial-prompt',
            'next-btn',
            'back-btn',
            'score-value',
            'score-label',
            'theme-toggle',
            'step-1',
            'step-2',
            'step-3',
            'step-4'
        ];
        
        console.log('DOM Elements Check:');
        let allFound = true;
        requiredIds.forEach(id => {
            const element = document.getElementById(id);
            const status = element ? '✓' : '✗';
            const color = element ? 'green' : 'red';
            if (!element) {
                allFound = false;
                console.error(`%c✗ Missing: #${id}`, 'color: red');
            } else {
                console.log(`%c✓ Found: #${id}`, 'color: green');
            }
        });
        
        if (!allFound) {
            console.error('%cSome DOM elements missing!', 'color: red; font-weight: bold');
            console.error('Fix: Check HTML IDs match JavaScript selectors');
        } else {
            console.log('%c✓ All required elements found', 'color: green; font-weight: bold');
        }
        
        return allFound;
    };
    
    // 4. Setup Error Tracking
    window.addEventListener('error', function(e) {
        console.error('%c[ERROR]', 'color: red; font-weight: bold', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
        });
    });
    
    // 5. Track Unhandled Promise Rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('%c[UNHANDLED PROMISE]', 'color: red; font-weight: bold', e.reason);
    });
    
    // 6. Run diagnostics on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('%c=== POST-LOAD DIAGNOSTICS ===', 'color: #6366f1; font-size: 14px; font-weight: bold');
            const scriptsLoaded = checkScripts();
            const elementsFound = checkElements();
            
            if (scriptsLoaded && elementsFound) {
                console.log('%c✓ ALL CHECKS PASSED - App should work!', 'color: green; font-size: 14px; font-weight: bold');
            } else {
                console.error('%c✗ CHECKS FAILED - See errors above', 'color: red; font-size: 14px; font-weight: bold');
            }
            
            console.log('%c=== END DIAGNOSTICS ===', 'color: #6366f1; font-size: 14px');
        });
    } else {
        // DOM already loaded
        setTimeout(() => {
            console.log('%c=== POST-LOAD DIAGNOSTICS ===', 'color: #6366f1; font-size: 14px; font-weight: bold');
            checkScripts();
            checkElements();
            console.log('%c=== END DIAGNOSTICS ===', 'color: #6366f1; font-size: 14px');
        }, 100);
    }
    
    // 7. Expose debugging helper
    window.debugPromptOptimizer = function() {
        console.log('=== MANUAL DEBUG ===');
        console.log('Scripts:', checkScripts());
        console.log('Elements:', checkElements());
        console.log('State:', window.appState || 'Not initialized');
        
        // Try to trigger analysis manually
        if (window.PromptAnalyzer) {
            const testPrompt = "Make me a simple webpage";
            console.log('Testing analyzer with:', testPrompt);
            const result = window.PromptAnalyzer.analyze(testPrompt, 'claude');
            console.log('Analysis result:', result);
        }
    };
    
    console.log('%cRun debugPromptOptimizer() in console for manual diagnostics', 'color: #8b5cf6; font-style: italic');
})();
