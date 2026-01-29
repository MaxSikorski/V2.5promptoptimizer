/**
 * PROMPT ANALYZER V2
 * Analyzes prompts using Anthropic's best practices and context engineering principles
 */

const PromptAnalyzer = {
    
    /**
     * Main analysis function
     * Returns comprehensive analysis object
     */
    analyze(text, model = 'claude') {
        if (!text || text.trim().length === 0) {
            return this.getEmptyAnalysis();
        }

        return {
            tokenCount: this.countTokens(text),
            components: this.analyzeComponents(text),
            contextEngineering: this.analyzeContextEngineering(text),
            modelFit: this.analyzeModelFit(text, model),
            overallScore: this.calculateOverallScore(text, model)
        };
    },

    /**
     * Token Counter
     * Approximation: 1 token ≈ 3.5 characters for English
     */
    countTokens(text) {
        // More accurate estimation
        const words = text.trim().split(/\s+/).length;
        const chars = text.length;
        
        // Average token count using multiple heuristics
        const byChars = Math.ceil(chars / 3.5);
        const byWords = Math.ceil(words / 0.75); // ~0.75 words per token
        
        return Math.round((byChars + byWords) / 2);
    },

    /**
     * Anthropic 10-Component Framework Analysis
     */
    analyzeComponents(text) {
        const components = {
            role: this.hasRole(text),
            tone: this.hasTone(text),
            background: this.hasBackground(text),
            task: this.hasTask(text),
            examples: this.hasExamples(text),
            chainOfThought: this.hasChainOfThought(text),
            outputFormat: this.hasOutputFormat(text),
            constraints: this.hasConstraints(text),
            prefill: this.hasPrefill(text),
            xmlStructure: this.hasXMLStructure(text)
        };

        const present = Object.values(components).filter(v => v).length;
        const missing = 10 - present;

        return {
            ...components,
            presentCount: present,
            missingCount: missing,
            score: (present / 10) * 100,
            missing: this.listMissingComponents(components)
        };
    },

    hasRole(text) {
        const patterns = [
            /\[ROLE\]/i,
            /you are (a|an) .{3,50} (expert|specialist|assistant|professional)/i,
            /act as (a|an)/i,
            /your role is/i
        ];
        return patterns.some(p => p.test(text));
    },

    hasTone(text) {
        const toneWords = ['professional', 'casual', 'formal', 'friendly', 'technical', 'conversational', 'academic', 'creative'];
        const pattern = new RegExp(`(tone|style|voice).{0,20}(${toneWords.join('|')})`, 'i');
        return pattern.test(text);
    },

    hasBackground(text) {
        const patterns = [
            /\[BACKGROUND\]/i,
            /\[CONTEXT\]/i,
            /background:/i,
            /context:/i,
            /given that/i
        ];
        return patterns.some(p => p.test(text));
    },

    hasTask(text) {
        const taskVerbs = ['write', 'create', 'analyze', 'generate', 'explain', 'summarize', 'evaluate', 'design', 'build', 'help'];
        const pattern = new RegExp(`\\b(${taskVerbs.join('|')})\\b.{5,}`, 'i');
        return pattern.test(text);
    },

    hasExamples(text) {
        const patterns = [
            /\[EXAMPLE\]/i,
            /for example/i,
            /e\.g\./i,
            /such as:/i,
            /example:/i
        ];
        return patterns.some(p => p.test(text));
    },

    hasChainOfThought(text) {
        const patterns = [
            /think step.{0,10}step/i,
            /thinking/i,
            /reason through/i,
            /analyze.{0,10}before/i,
            /first.*then/i
        ];
        return patterns.some(p => p.test(text));
    },

    hasOutputFormat(text) {
        const patterns = [
            /\[OUTPUT\]/i,
            /\[FORMAT\]/i,
            /output.{0,20}(format|should be|must be)/i,
            /format.{0,20}:/i,
            /(json|markdown|html|csv)/i
        ];
        return patterns.some(p => p.test(text));
    },

    hasConstraints(text) {
        const patterns = [
            /\[CONSTRAINTS\]/i,
            /\[REQUIREMENTS\]/i,
            /must (not|never|always)/i,
            /should (not|never|always)/i,
            /do not/i
        ];
        return patterns.some(p => p.test(text));
    },

    hasPrefill(text) {
        // Prefill is hard to detect in user's original prompt
        // This is more useful for our optimizer to add
        return text.includes('[OUTPUT]:') || text.includes('Begin with:');
    },

    hasXMLStructure(text) {
        return /<[^>]+>/.test(text);
    },

    listMissingComponents(components) {
        const missing = [];
        const names = {
            role: 'Role/Persona',
            tone: 'Tone Context',
            background: 'Background Data',
            task: 'Task Description',
            examples: 'Examples',
            chainOfThought: 'Chain-of-Thought',
            outputFormat: 'Output Format',
            constraints: 'Constraints',
            prefill: 'Response Prefill',
            xmlStructure: 'XML Structure'
        };

        for (const [key, value] of Object.entries(components)) {
            if (value === false && names[key]) {
                missing.push(names[key]);
            }
        }

        return missing;
    },

    /**
     * Context Engineering Analysis
     * Based on Anthropic's December 2025 guidance
     */
    analyzeContextEngineering(text) {
        return {
            tokenEfficiency: this.calculateTokenEfficiency(text),
            signalDensity: this.calculateSignalDensity(text),
            altitude: this.detectAltitude(text),
            redundancy: this.detectRedundancy(text)
        };
    },

    calculateTokenEfficiency(text) {
        const total = this.countTokens(text);
        const useful = this.countHighSignalTokens(text);
        const efficiency = total > 0 ? (useful / total) * 100 : 0;

        return {
            total,
            useful,
            efficiency: Math.round(efficiency),
            rating: this.rateEfficiency(efficiency)
        };
    },

    countHighSignalTokens(text) {
        // High-signal patterns
        const highSignalPatterns = [
            /must|never|always|required|specifically|exactly/gi,
            /format:|output:|structure:|style:/gi,
            /example:|e\.g\.|for instance:/gi,
            /<[^>]+>/g,  // XML tags
            /\[[^\]]+\]/g  // Bracketed sections
        ];

        let highSignalChars = 0;
        highSignalPatterns.forEach(pattern => {
            const matches = text.match(pattern) || [];
            matches.forEach(match => {
                highSignalChars += match.length;
            });
        });

        return Math.ceil(highSignalChars / 3.5);
    },

    rateEfficiency(efficiency) {
        if (efficiency >= 85) return 'excellent';
        if (efficiency >= 70) return 'good';
        if (efficiency >= 50) return 'fair';
        return 'poor';
    },

    calculateSignalDensity(text) {
        const words = text.trim().split(/\s+/);
        const totalWords = words.length;

        // Count high-value words
        const highValueWords = words.filter(word => {
            return /^(must|never|always|required|specific|exact|only|format|output|constraint)/i.test(word);
        }).length;

        // Count low-value words (filler)
        const fillerWords = words.filter(word => {
            return /^(very|really|quite|basically|actually|literally|perhaps|maybe|possibly)/i.test(word);
        }).length;

        const density = totalWords > 0 ? 
            ((highValueWords - fillerWords) / totalWords) * 100 + 50 : 50;

        return {
            density: Math.max(0, Math.min(100, Math.round(density))),
            highValueCount: highValueWords,
            fillerCount: fillerWords,
            rating: this.rateDensity(density)
        };
    },

    rateDensity(density) {
        if (density >= 80) return 'high';
        if (density >= 60) return 'medium';
        return 'low';
    },

    detectAltitude(text) {
        // Too Low: Overly prescriptive, hardcoded logic
        const lowMarkers = [
            /if .{5,30} then/gi,
            /when .{5,30} do/gi,
            /step \d+:/gi,
            /first .{5,20} second .{5,20} third/gi
        ];

        // Too High: Vague, no concrete guidance
        const highMarkers = [
            /be helpful/gi,
            /do your best/gi,
            /be creative/gi,
            /be good/gi,
            /be professional(?! .{5,})/gi  // "be professional" alone without specifics
        ];

        // Just Right: Principle-based, specific but flexible
        const goodMarkers = [
            /focus on/gi,
            /prioritize/gi,
            /ensure that/gi,
            /when (analyzing|writing|creating|reviewing)/gi,
            /must (include|contain|have|follow)/gi
        ];

        let lowScore = 0;
        let highScore = 0;
        let goodScore = 0;

        lowMarkers.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) lowScore += matches.length;
        });

        highMarkers.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) highScore += matches.length;
        });

        goodMarkers.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) goodScore += matches.length;
        });

        // Determine altitude
        if (lowScore > 2) return 'too-low';
        if (highScore > 2 && goodScore < 2) return 'too-high';
        return 'just-right';
    },

    detectRedundancy(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        let redundantPhrases = 0;

        // Check for repeated phrases (3+ words)
        const phrases = [];
        sentences.forEach(sentence => {
            const words = sentence.trim().toLowerCase().split(/\s+/);
            for (let i = 0; i < words.length - 2; i++) {
                const phrase = words.slice(i, i + 3).join(' ');
                if (phrases.includes(phrase)) {
                    redundantPhrases++;
                } else {
                    phrases.push(phrase);
                }
            }
        });

        return {
            score: redundantPhrases,
            level: redundantPhrases > 3 ? 'high' : redundantPhrases > 1 ? 'medium' : 'low'
        };
    },

    /**
     * Model-Specific Fit Analysis
     */
    analyzeModelFit(text, model) {
        const modelAnalyzers = {
            claude: this.analyzeClaudeFit,
            gpt: this.analyzeGPTFit,
            gemini: this.analyzeGeminiFit
        };

        const analyzer = modelAnalyzers[model] || modelAnalyzers.claude;
        return analyzer.call(this, text);
    },

    analyzeClaudeFit(text) {
        const issues = [];
        const strengths = [];

        // Claude 4.x needs explicit "go beyond" for creative tasks
        if (this.isCreativeTask(text) && !this.hasExplicitRequest(text)) {
            issues.push('Add explicit "go beyond basics" request for creative tasks');
        }

        // Should have motivation/context for complex instructions
        if (text.length > 200 && !text.toLowerCase().includes('because')) {
            issues.push('Add motivation/context for better Claude 4.x performance');
        }

        // Check for examples alignment
        if (this.hasExamples(text)) {
            strengths.push('Has examples (Claude 4.x pays close attention)');
        }

        // Check for thinking block
        if (this.isAnalyticalTask(text) && !/<thinking>/i.test(text)) {
            issues.push('Consider adding <thinking> block for analytical tasks');
        }

        return {
            compatibility: Math.max(0, 100 - (issues.length * 15)),
            strengths,
            issues,
            model: 'Claude 4.5'
        };
    },

    analyzeGPTFit(text) {
        const issues = [];
        const strengths = [];

        // GPT benefits from explicit step-by-step
        if (!this.hasChainOfThought(text)) {
            issues.push('Add step-by-step reasoning request');
        }

        // Check for format specification
        if (!this.hasOutputFormat(text)) {
            issues.push('GPT performs better with explicit format specification');
        }

        return {
            compatibility: Math.max(0, 100 - (issues.length * 15)),
            strengths,
            issues,
            model: 'GPT-5'
        };
    },

    analyzeGeminiFit(text) {
        const issues = [];
        const strengths = [];

        // Gemini needs grounding
        if (!text.toLowerCase().includes('context') && text.length < 100) {
            issues.push('Add context/grounding for Gemini');
        }

        // Check for boundaries
        if (!this.hasConstraints(text)) {
            issues.push('Gemini benefits from explicit boundaries');
        }

        return {
            compatibility: Math.max(0, 100 - (issues.length * 15)),
            strengths,
            issues,
            model: 'Gemini 3'
        };
    },

    isCreativeTask(text) {
        const creativeWords = ['write', 'create', 'design', 'imagine', 'story', 'poem', 'article', 'blog'];
        return creativeWords.some(word => text.toLowerCase().includes(word));
    },

    isAnalyticalTask(text) {
        const analyticalWords = ['analyze', 'evaluate', 'assess', 'compare', 'review', 'examine'];
        return analyticalWords.some(word => text.toLowerCase().includes(word));
    },

    hasExplicitRequest(text) {
        const patterns = [
            /go beyond/i,
            /comprehensive/i,
            /fully.{0,10}featured/i,
            /extensive/i,
            /thorough/i
        ];
        return patterns.some(p => p.test(text));
    },

    /**
     * Overall Score Calculation
     */
    calculateOverallScore(text, model) {
        const components = this.analyzeComponents(text);
        const contextEng = this.analyzeContextEngineering(text);
        const modelFit = this.analyzeModelFit(text, model);

        // Weighted scoring
        const componentScore = components.score / 10; // 0-10
        const efficiencyScore = contextEng.tokenEfficiency.efficiency / 10; // 0-10
        const altitudeScore = contextEng.altitude === 'just-right' ? 10 : 
                             contextEng.altitude === 'too-high' ? 5 : 3;
        const modelScore = modelFit.compatibility / 10; // 0-10

        const weights = {
            components: 0.30,
            efficiency: 0.25,
            altitude: 0.25,
            model: 0.20
        };

        const weighted = 
            (componentScore * weights.components) +
            (efficiencyScore * weights.efficiency) +
            (altitudeScore * weights.altitude) +
            (modelScore * weights.model);

        return {
            score: Math.round(weighted * 10) / 10,
            maxScore: 10,
            rating: this.getScoreRating(weighted),
            breakdown: {
                components: componentScore,
                efficiency: efficiencyScore,
                altitude: altitudeScore,
                modelFit: modelScore
            }
        };
    },

    getScoreRating(score) {
        if (score >= 9) return { label: 'Excellent', color: '#10b981' };
        if (score >= 7.5) return { label: 'Very Good', color: '#3b82f6' };
        if (score >= 6) return { label: 'Good', color: '#8b5cf6' };
        if (score >= 4) return { label: 'Fair', color: '#f59e0b' };
        return { label: 'Needs Work', color: '#ef4444' };
    },

    /**
     * Empty Analysis (for initialization)
     */
    getEmptyAnalysis() {
        return {
            tokenCount: 0,
            components: {
                presentCount: 0,
                missingCount: 10,
                score: 0,
                missing: []
            },
            contextEngineering: {
                tokenEfficiency: { total: 0, useful: 0, efficiency: 0, rating: 'poor' },
                signalDensity: { density: 0, rating: 'low' },
                altitude: 'unknown',
                redundancy: { score: 0, level: 'low' }
            },
            modelFit: {
                compatibility: 0,
                strengths: [],
                issues: []
            },
            overallScore: {
                score: 0,
                maxScore: 10,
                rating: { label: 'Waiting', color: '#6b7280' },
                breakdown: {}
            }
        };
    },

    /**
     * Get Follow-up Questions
     * Based on detected task type and missing components
     */
    getFollowUpQuestions(text, analysis) {
        const questions = [];
        const lower = text.toLowerCase();

        // Detect task type and generate relevant questions
        if (lower.includes('code') || lower.includes('script') || lower.includes('program')) {
            questions.push({
                id: 'language',
                label: 'Programming Language',
                question: 'Which language/framework should be used?',
                placeholder: 'e.g., Python 3.11, React 18, TypeScript...'
            });
            questions.push({
                id: 'constraints',
                label: 'Technical Constraints',
                question: 'Any libraries to use or avoid?',
                placeholder: 'e.g., Use only standard library, no external dependencies...'
            });
        } else if (lower.includes('email') || lower.includes('letter') || lower.includes('message')) {
            questions.push({
                id: 'tone',
                label: 'Tone',
                question: 'What tone should it have?',
                placeholder: 'e.g., Professional, friendly, formal, urgent...'
            });
            questions.push({
                id: 'recipient',
                label: 'Recipient',
                question: 'Who is the recipient?',
                placeholder: 'e.g., Manager, client, team member...'
            });
        } else if (lower.includes('write') || lower.includes('article') || lower.includes('blog')) {
            questions.push({
                id: 'length',
                label: 'Length',
                question: 'Desired length?',
                placeholder: 'e.g., 500 words, 3 paragraphs...'
            });
            questions.push({
                id: 'style',
                label: 'Writing Style',
                question: 'Any specific style?',
                placeholder: 'e.g., Academic, conversational, technical...'
            });
        }

        // Generic questions based on missing components
        if (!analysis.components.task) {
            questions.push({
                id: 'goal',
                label: 'Primary Goal',
                question: 'What is the main thing the AI must get right?',
                placeholder: 'e.g., Accuracy, speed, tone, creativity...'
            });
        }

        // Always ask about what NOT to do
        questions.push({
            id: 'avoid',
            label: 'What to Avoid',
            question: 'What should the AI NOT do?',
            placeholder: 'e.g., No jargon, no preamble, no comparisons...'
        });

        return questions.slice(0, 3); // Max 3 questions
    }
};

// Make it available globally
window.PromptAnalyzer = PromptAnalyzer;
