/**
 * PROMPT OPTIMIZER V2 - Main Application
 * Handles UI state, user interactions, and orchestrates analysis/optimization
 */

// CRITICAL: Check dependencies before starting
(function checkDependencies() {
    const required = {
        'PromptAnalyzer': window.PromptAnalyzer,
        'PromptOptimizer': window.PromptOptimizer,
        'ModelData': window.ModelData,
        'TooltipContent': window.TooltipContent
    };
    
    const missing = [];
    for (const [name, value] of Object.entries(required)) {
        if (typeof value === 'undefined') {
            missing.push(name);
            console.error(`❌ ${name} not loaded`);
        } else {
            console.log(`✓ ${name} loaded`);
        }
    }
    
    if (missing.length > 0) {
        console.error('CRITICAL: Missing dependencies:', missing);
        alert(`Error: Failed to load required scripts:\n${missing.join(', ')}\n\nPlease check that all .js files are in the correct location.`);
        throw new Error(`Missing dependencies: ${missing.join(', ')}`);
    }
    
    console.log('✓ All dependencies loaded successfully');
})();

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting Prompt Optimizer V2...');
    // Application State
    const state = {
        currentStep: 1,
        selectedModel: 'claude',
        originalPrompt: '',
        optimizedPrompt: '',
        analysis: null,
        optimizationResult: null,
        refinementAnswers: {},
        options: {
            level: 'standard',
            format: 'standard',
            concise: false,
            noPreamble: false,
            showThinking: false
        },
        savedPrompts: JSON.parse(localStorage.getItem('promptOptimizer_saved') || '[]')
    };

    // DOM Elements
    const promptInput = document.getElementById('initial-prompt');
    const modelCards = document.querySelectorAll('.model-card');
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const steps = document.querySelectorAll('.step-container');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Theme
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Modals
    const infoBtn = document.getElementById('info-btn');
    const libraryBtn = document.getElementById('library-btn');
    const infoModal = document.getElementById('info-modal');
    const libraryModal = document.getElementById('library-modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    // Analysis Elements
    const toggleAnalysis = document.getElementById('toggle-analysis');
    const analysisDetails = document.getElementById('analysis-details');
    const scoreValue = document.getElementById('score-value');
    const scoreLabel = document.getElementById('score-label');
    const scoreMessage = document.getElementById('score-message');
    const scoreRingFill = document.getElementById('score-ring-fill');
    const tokenCounter = document.querySelector('.token-counter');

    // Metrics
    const metricEfficiency = document.getElementById('metric-efficiency');
    const metricSignal = document.getElementById('metric-signal');
    const metricAltitude = document.getElementById('metric-altitude');
    const metricComponents = document.getElementById('metric-components');
    const barEfficiency = document.getElementById('bar-efficiency');
    const barSignal = document.getElementById('bar-signal');
    const altitudeIndicator = document.getElementById('altitude-indicator');
    const componentList = document.getElementById('component-list');

    // Step 2
    const dynamicQuestions = document.getElementById('dynamic-questions');

    // Step 3
    const optLevelRadios = document.querySelectorAll('input[name="opt-level"]');
    const outputFormatSelect = document.getElementById('output-format');
    const optConcise = document.getElementById('opt-concise');
    const optNoPreamble = document.getElementById('opt-no-preamble');
    const optShowThinking = document.getElementById('opt-show-thinking');

    // Step 4
    const improvementScore = document.getElementById('improvement-score');
    const improvementEfficiency = document.getElementById('improvement-efficiency');
    const improvementCost = document.getElementById('improvement-cost');
    const techniquesList = document.getElementById('techniques-list');
    const viewBtns = document.querySelectorAll('.view-btn');
    const comparisonView = document.getElementById('comparison-view');
    const optimizedView = document.getElementById('optimized-view');
    const originalPreview = document.getElementById('original-preview');
    const optimizedPreview = document.getElementById('optimized-preview');
    const finalPreview = document.getElementById('final-preview');
    const originalTokens = document.getElementById('original-tokens');
    const optimizedTokens = document.getElementById('optimized-tokens');
    const copyOptimizedBtn = document.getElementById('copy-optimized-btn');
    const saveToLibraryBtn = document.getElementById('save-to-library-btn');
    const copyToast = document.getElementById('copy-toast');

    // Tooltip
    const tooltip = document.getElementById('tooltip');
    const tooltipContent = document.getElementById('tooltip-content');

    // Initialize
    init();

    function init() {
        console.log('📝 Initializing application...');
        
        // Verify critical elements
        const criticalElements = {
            promptInput: promptInput,
            modelCards: modelCards,
            nextBtn: nextBtn,
            backBtn: backBtn,
            scoreValue: scoreValue
        };
        
        let missingElements = [];
        for (const [name, element] of Object.entries(criticalElements)) {
            if (!element || (element.length !== undefined && element.length === 0)) {
                missingElements.push(name);
                console.error(`❌ Critical element missing: ${name}`);
            } else {
                console.log(`✓ Found: ${name}`);
            }
        }
        
        if (missingElements.length > 0) {
            console.error('CRITICAL: Missing DOM elements:', missingElements);
            alert(`Setup Error: Missing elements:\n${missingElements.join(', ')}\n\nPage may not work correctly.`);
        }
        
        try {
            setupEventListeners();
            console.log('✓ Event listeners set up');
            
            loadTheme();
            console.log('✓ Theme loaded');
            
            updateStepDisplay();
            console.log('✓ Step display updated');
            
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log('✓ Lucide icons initialized');
                
                // Verify icons rendered
                setTimeout(() => {
                    const iconCount = document.querySelectorAll('svg.lucide').length;
                    if (iconCount === 0) {
                        console.warn('⚠️ No Lucide icons found - icons may not be rendering');
                    } else {
                        console.log(`✓ Rendered ${iconCount} icons`);
                    }
                }, 100);
            } else {
                console.error('❌ Lucide library not loaded from CDN');
            }
            
            console.log('✅ Application initialized successfully!');
            console.log('👉 Type in the prompt textarea to test');
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
            alert(`Initialization Error: ${error.message}\n\nCheck browser console for details.`);
        }
    }

    function setupEventListeners() {
        // Theme Toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Modals
        infoBtn.addEventListener('click', () => showModal(infoModal));
        libraryBtn.addEventListener('click', () => {
            showModal(libraryModal);
            renderLibrary();
        });
        modalCloses.forEach(btn => btn.addEventListener('click', closeModals));
        modalOverlays.forEach(overlay => overlay.addEventListener('click', closeModals));

        // Model Selection
        modelCards.forEach(card => {
            card.addEventListener('click', () => {
                modelCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                state.selectedModel = card.dataset.model;
                if (state.analysis) {
                    analyzePrompt();
                }
            });
        });

        // Prompt Input - Real-time Analysis
        let analyzeTimeout;
        promptInput.addEventListener('input', (e) => {
            console.log('⌨️ Input detected:', e.target.value.length, 'characters');
            clearTimeout(analyzeTimeout);
            analyzeTimeout = setTimeout(() => {
                state.originalPrompt = promptInput.value;
                console.log('📊 Triggering analysis...');
                analyzePrompt();
            }, 300);
        });
        
        // Add a test to verify event is working
        console.log('✓ Input event listener attached to:', promptInput.id || promptInput);

        // Toggle Analysis Details
        if (toggleAnalysis) {
            toggleAnalysis.addEventListener('click', () => {
                analysisDetails.classList.toggle('hidden');
                const icon = toggleAnalysis.querySelector('i');
                const text = toggleAnalysis.querySelector('span');
                if (analysisDetails.classList.contains('hidden')) {
                    text.textContent = 'Show Details';
                    icon.setAttribute('data-lucide', 'chevron-down');
                } else {
                    text.textContent = 'Hide Details';
                    icon.setAttribute('data-lucide', 'chevron-up');
                }
                lucide.createIcons();
            });
        }

        // Info Icons - Tooltips
        document.querySelectorAll('.info-icon').forEach(icon => {
            icon.addEventListener('mouseenter', (e) => showTooltip(e, icon.dataset.tooltip));
            icon.addEventListener('mouseleave', hideTooltip);
        });

        // Navigation
        nextBtn.addEventListener('click', handleNext);
        backBtn.addEventListener('click', handleBack);

        // Step 3 - Options
        optLevelRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                state.options.level = radio.value;
                document.querySelectorAll('.radio-card').forEach(card => {
                    card.classList.remove('selected');
                });
                radio.closest('.radio-card').classList.add('selected');
            });
        });

        outputFormatSelect.addEventListener('change', () => {
            state.options.format = outputFormatSelect.value;
        });

        optConcise.addEventListener('change', () => {
            state.options.concise = optConcise.checked;
        });

        optNoPreamble.addEventListener('change', () => {
            state.options.noPreamble = optNoPreamble.checked;
        });

        optShowThinking.addEventListener('change', () => {
            state.options.showThinking = optShowThinking.checked;
        });

        // Step 4 - View Toggle
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (btn.dataset.view === 'side-by-side') {
                    comparisonView.classList.remove('hidden');
                    optimizedView.classList.add('hidden');
                } else {
                    comparisonView.classList.add('hidden');
                    optimizedView.classList.remove('hidden');
                }
            });
        });

        // Copy & Save
        copyOptimizedBtn.addEventListener('click', () => copyToClipboard(state.optimizedPrompt));
        document.getElementById('copy-prompt-btn')?.addEventListener('click', () => copyToClipboard(state.optimizedPrompt));
        saveToLibraryBtn.addEventListener('click', saveToLibrary);
        document.getElementById('save-prompt-btn')?.addEventListener('click', saveToLibrary);
        document.getElementById('download-prompt-btn')?.addEventListener('click', downloadPrompt);

        // Library
        document.getElementById('clear-library-btn')?.addEventListener('click', clearLibrary);
        document.getElementById('library-search')?.addEventListener('input', (e) => {
            renderLibrary(e.target.value);
        });
    }

    function analyzePrompt() {
        const text = state.originalPrompt;
        
        console.log('🔍 Analyzing prompt...', {
            length: text.length,
            preview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
        });
        
        if (!text || text.trim().length === 0) {
            console.log('⚠️ Empty prompt - resetting to default state');
            state.analysis = null;
            updateAnalysisUI(PromptAnalyzer.getEmptyAnalysis());
            nextBtn.disabled = true;
            return;
        }

        try {
            state.analysis = PromptAnalyzer.analyze(text, state.selectedModel);
            console.log('✓ Analysis complete:', {
                score: state.analysis.overallScore.score,
                tokens: state.analysis.tokenCount,
                components: state.analysis.components.presentCount
            });
            
            updateAnalysisUI(state.analysis);
            nextBtn.disabled = false;
            console.log('✓ UI updated, next button enabled');
            
        } catch (error) {
            console.error('❌ Analysis error:', error);
            alert(`Analysis Error: ${error.message}\n\nCheck console for details.`);
        }
    }

    function updateAnalysisUI(analysis) {
        const score = analysis.overallScore.score;
        const rating = analysis.overallScore.rating;

        // Score Circle
        scoreValue.textContent = score.toFixed(1);
        scoreLabel.textContent = rating.label;
        scoreLabel.style.color = rating.color;
        
        // Score ring (circumference = 2 * π * r = 282.7)
        const circumference = 282.7;
        const offset = circumference - (score / 10) * circumference;
        scoreRingFill.style.strokeDashoffset = offset;
        scoreRingFill.style.stroke = rating.color;

        // Score message
        if (score === 0) {
            scoreMessage.textContent = 'Start typing to see analysis';
        } else if (score < 4) {
            scoreMessage.textContent = 'Needs significant improvement';
        } else if (score < 7) {
            scoreMessage.textContent = 'Good foundation, can be optimized';
        } else if (score < 9) {
            scoreMessage.textContent = 'Strong prompt, minor optimizations possible';
        } else {
            scoreMessage.textContent = 'Excellent prompt quality!';
        }

        // Token Count
        tokenCounter.textContent = `${analysis.tokenCount} tokens`;

        // Detailed Metrics
        const eff = analysis.contextEngineering.tokenEfficiency;
        metricEfficiency.textContent = `${eff.efficiency}%`;
        metricEfficiency.style.color = getRatingColor(eff.rating);
        barEfficiency.style.width = `${eff.efficiency}%`;
        barEfficiency.style.backgroundColor = getRatingColor(eff.rating);

        const sig = analysis.contextEngineering.signalDensity;
        metricSignal.textContent = `${sig.density}%`;
        metricSignal.style.color = getRatingColor(sig.rating);
        barSignal.style.width = `${sig.density}%`;
        barSignal.style.backgroundColor = getRatingColor(sig.rating);

        const alt = analysis.contextEngineering.altitude;
        metricAltitude.textContent = formatAltitude(alt);
        metricAltitude.style.color = getAltitudeColor(alt);
        updateAltitudeIndicator(alt);

        const comp = analysis.components;
        metricComponents.textContent = `${comp.presentCount}/10`;
        metricComponents.style.color = comp.presentCount >= 7 ? '#10b981' : comp.presentCount >= 4 ? '#f59e0b' : '#ef4444';
        updateComponentList(comp);
    }

    function getRatingColor(rating) {
        const colors = {
            excellent: '#10b981',
            good: '#3b82f6',
            fair: '#f59e0b',
            poor: '#ef4444',
            high: '#10b981',
            medium: '#f59e0b',
            low: '#ef4444'
        };
        return colors[rating] || '#6b7280';
    }

    function getAltitudeColor(altitude) {
        return altitude === 'just-right' ? '#10b981' : '#f59e0b';
    }

    function formatAltitude(altitude) {
        const labels = {
            'too-low': 'Too Low',
            'too-high': 'Too High',
            'just-right': 'Just Right',
            'unknown': 'Unknown'
        };
        return labels[altitude] || altitude;
    }

    function updateAltitudeIndicator(altitude) {
        const positions = {
            'too-low': '15%',
            'just-right': '50%',
            'too-high': '85%'
        };
        
        altitudeIndicator.innerHTML = `
            <div style="position: relative; height: 8px; background: linear-gradient(to right, #ef4444, #10b981, #ef4444); border-radius: 4px; margin-top: 8px;">
                <div style="position: absolute; left: ${positions[altitude] || '50%'}; top: -4px; width: 16px; height: 16px; background: white; border: 3px solid ${getAltitudeColor(altitude)}; border-radius: 50%; transform: translateX(-50%);"></div>
            </div>
        `;
    }

    function updateComponentList(components) {
        const icons = {
            true: '<i data-lucide="check-circle" style="width: 16px; height: 16px; color: #10b981;"></i>',
            false: '<i data-lucide="x-circle" style="width: 16px; height: 16px; color: #ef4444;"></i>'
        };

        const items = [
            { key: 'role', label: 'Role' },
            { key: 'task', label: 'Task' },
            { key: 'outputFormat', label: 'Format' },
            { key: 'constraints', label: 'Constraints' }
        ];

        componentList.innerHTML = items.map(item => `
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; margin-top: 4px;">
                ${icons[components[item.key]]}
                <span>${item.label}</span>
            </div>
        `).join('');

        lucide.createIcons();
    }

    function handleNext() {
        if (state.currentStep === 1) {
            // Generate follow-up questions
            generateFollowUpQuestions();
        } else if (state.currentStep === 2) {
            // Collect answers
            collectRefinementAnswers();
        } else if (state.currentStep === 3) {
            // Perform optimization
            performOptimization();
        } else if (state.currentStep === 4) {
            // Start over
            window.location.reload();
            return;
        }

        if (state.currentStep < 4) {
            state.currentStep++;
            updateStepDisplay();
        }
    }

    function handleBack() {
        if (state.currentStep > 1) {
            state.currentStep--;
            updateStepDisplay();
        }
    }

    function updateStepDisplay() {
        steps.forEach((step, idx) => {
            step.classList.toggle('active', (idx + 1) === state.currentStep);
        });

        progressSteps.forEach((step, idx) => {
            step.classList.toggle('active', (idx + 1) === state.currentStep);
            step.classList.toggle('completed', (idx + 1) < state.currentStep);
        });

        backBtn.style.visibility = state.currentStep === 1 ? 'hidden' : 'visible';

        if (state.currentStep === 4) {
            nextBtn.innerHTML = '<i data-lucide="refresh-cw"></i> Start Over';
        } else if (state.currentStep === 3) {
            nextBtn.innerHTML = 'Optimize Prompt <i data-lucide="sparkles"></i>';
        } else {
            nextBtn.innerHTML = 'Next Step <i data-lucide="arrow-right"></i>';
        }

        nextBtn.disabled = false;
        lucide.createIcons();
    }

    function generateFollowUpQuestions() {
        const questions = PromptAnalyzer.getFollowUpQuestions(state.originalPrompt, state.analysis);
        
        dynamicQuestions.innerHTML = questions.map(q => `
            <div class="question-card">
                <label class="question-label">${q.label}</label>
                <p class="question-text">${q.question}</p>
                <input type="text" class="question-input" data-id="${q.id}" placeholder="${q.placeholder}">
            </div>
        `).join('');

        // Add listeners
        document.querySelectorAll('.question-input').forEach(input => {
            input.addEventListener('input', (e) => {
                state.refinementAnswers[e.target.dataset.id] = e.target.value;
            });
        });
    }

    function collectRefinementAnswers() {
        // Answers already collected via event listeners
    }

    function performOptimization() {
        // Merge refinement answers into prompt context
        let contextPrompt = state.originalPrompt;
        if (Object.keys(state.refinementAnswers).length > 0) {
            contextPrompt += '\n\n[ADDITIONAL CONTEXT]:\n';
            for (const [key, value] of Object.entries(state.refinementAnswers)) {
                if (value) {
                    contextPrompt += `- ${key}: ${value}\n`;
                }
            }
        }

        // Perform optimization
        state.optimizationResult = PromptOptimizer.optimize(
            contextPrompt,
            state.analysis,
            state.selectedModel,
            state.options.level,
            state.options
        );

        state.optimizedPrompt = state.optimizationResult.optimized;

        // Update results UI
        updateResultsUI();
    }

    function updateResultsUI() {
        const result = state.optimizationResult;
        const improvements = result.improvements;

        // Improvements
        improvementScore.textContent = improvements.scoreChange >= 0 ? 
            `+${improvements.scoreChange.toFixed(1)}` : improvements.scoreChange.toFixed(1);
        improvementScore.style.color = improvements.scoreChange >= 0 ? '#10b981' : '#ef4444';

        improvementEfficiency.textContent = improvements.efficiencyChange >= 0 ?
            `+${improvements.efficiencyChange}%` : `${improvements.efficiencyChange}%`;
        improvementEfficiency.style.color = improvements.efficiencyChange >= 0 ? '#10b981' : '#ef4444';

        improvementCost.textContent = `$${improvements.costPerCall}`;
        improvementCost.style.color = '#6b7280';

        // Techniques
        techniquesList.innerHTML = result.techniques.map(tech => `
            <div class="technique-item">
                <div class="technique-icon">
                    <i data-lucide="check"></i>
                </div>
                <div class="technique-content">
                    <div class="technique-name">${tech.name}</div>
                    <div class="technique-description">${tech.description}</div>
                </div>
            </div>
        `).join('');

        // Prompts
        originalPreview.textContent = result.original;
        optimizedPreview.textContent = result.optimized;
        finalPreview.textContent = result.optimized;

        // Token counts
        originalTokens.textContent = `${state.analysis.tokenCount} tokens`;
        optimizedTokens.textContent = `${result.newAnalysis.tokenCount} tokens`;

        lucide.createIcons();
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            copyToast.classList.add('show');
            setTimeout(() => {
                copyToast.classList.remove('show');
            }, 2000);
        });
    }

    function saveToLibrary() {
        if (!state.optimizedPrompt) return;

        const prompt = {
            id: Date.now(),
            original: state.originalPrompt,
            optimized: state.optimizedPrompt,
            model: state.selectedModel,
            score: state.optimizationResult.newAnalysis.overallScore.score,
            date: new Date().toISOString()
        };

        state.savedPrompts.unshift(prompt);
        localStorage.setItem('promptOptimizer_saved', JSON.stringify(state.savedPrompts));

        copyToast.querySelector('span')?.textContent = 'Saved to library!';
        copyToast.classList.add('show');
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 2000);
    }

    function downloadPrompt() {
        const blob = new Blob([state.optimizedPrompt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimized-prompt-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function renderLibrary(searchTerm = '') {
        const libraryList = document.getElementById('library-list');
        const libraryEmpty = document.getElementById('library-empty');

        let prompts = state.savedPrompts;
        if (searchTerm) {
            prompts = prompts.filter(p => 
                p.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.optimized.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (prompts.length === 0) {
            libraryList.style.display = 'none';
            libraryEmpty.style.display = 'flex';
        } else {
            libraryList.style.display = 'grid';
            libraryEmpty.style.display = 'none';

            libraryList.innerHTML = prompts.map(p => `
                <div class="library-item">
                    <div class="library-item-header">
                        <span class="library-score">${p.score.toFixed(1)}/10</span>
                        <span class="library-model">${ModelData[p.model]?.name}</span>
                    </div>
                    <div class="library-item-preview">${p.optimized.substring(0, 150)}...</div>
                    <div class="library-item-actions">
                        <button class="library-btn" onclick="loadFromLibrary(${p.id})">
                            <i data-lucide="download"></i>
                            Load
                        </button>
                        <button class="library-btn" onclick="deleteFromLibrary(${p.id})">
                            <i data-lucide="trash-2"></i>
                            Delete
                        </button>
                    </div>
                </div>
            `).join('');

            lucide.createIcons();
        }
    }

    window.loadFromLibrary = (id) => {
        const prompt = state.savedPrompts.find(p => p.id === id);
        if (prompt) {
            promptInput.value = prompt.original;
            state.originalPrompt = prompt.original;
            state.selectedModel = prompt.model;
            
            // Update model selection
            modelCards.forEach(card => {
                card.classList.toggle('selected', card.dataset.model === prompt.model);
            });

            analyzePrompt();
            closeModals();
        }
    };

    window.deleteFromLibrary = (id) => {
        state.savedPrompts = state.savedPrompts.filter(p => p.id !== id);
        localStorage.setItem('promptOptimizer_saved', JSON.stringify(state.savedPrompts));
        renderLibrary();
    };

    function clearLibrary() {
        if (confirm('Are you sure you want to delete all saved prompts?')) {
            state.savedPrompts = [];
            localStorage.removeItem('promptOptimizer_saved');
            renderLibrary();
        }
    }

    function showTooltip(e, type) {
        const content = TooltipContent[type];
        if (!content) return;

        let html = `<h4>${content.title}</h4><p>${content.description}</p>`;

        if (content.example) {
            html += `<div class="tooltip-example">
                <strong>Poor:</strong> ${content.example.poor}<br>
                <strong>Good:</strong> ${content.example.good}
            </div>`;
        }

        if (content.details) {
            html += `<ul>${content.details.map(d => `<li>${d}</li>`).join('')}</ul>`;
        }

        if (content.list) {
            html += `<ul>${content.list.map(l => `<li>${l}</li>`).join('')}</ul>`;
        }

        tooltipContent.innerHTML = html;
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 10) + 'px';
        tooltip.classList.add('show');
    }

    function hideTooltip() {
        tooltip.classList.remove('show');
    }

    function showModal(modal) {
        modal.style.display = 'flex';
    }

    function closeModals() {
        infoModal.style.display = 'none';
        libraryModal.style.display = 'none';
    }

    function toggleTheme() {
        body.classList.toggle('light-mode');
        saveTheme();
        updateThemeIcon();
    }

    function loadTheme() {
        const saved = localStorage.getItem('promptOptimizer_theme');
        if (saved === 'light') {
            body.classList.add('light-mode');
        }
        updateThemeIcon();
    }

    function saveTheme() {
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('promptOptimizer_theme', theme);
    }

    function updateThemeIcon() {
        const isLight = body.classList.contains('light-mode');
        themeToggle.innerHTML = `<i data-lucide="${isLight ? 'moon' : 'sun'}" id="theme-icon"></i>`;
        lucide.createIcons();
    }
});
