/**
 * PROMPT OPTIMIZER V2
 * Optimizes prompts using research-backed techniques
 */

const PromptOptimizer = {
    
    /**
     * Main optimization function
     */
    optimize(originalPrompt, analysis, model, level = 'standard', options = {}) {
        this.originalPrompt = originalPrompt;
        this.analysis = analysis;
        this.model = model;
        this.level = level;
        this.options = options;
        this.techniques = [];

        let optimized = originalPrompt;

        // Apply optimizations based on level
        if (level === 'quick' || level === 'standard' || level === 'advanced') {
            optimized = this.removeRedundancy(optimized);
            optimized = this.improveClarity(optimized);
        }

        if (level === 'standard' || level === 'advanced') {
            optimized = this.addFrameworkStructure(optimized);
            optimized = this.correctAltitude(optimized);
            optimized = this.applyModelSpecificRules(optimized);
        }

        if (level === 'advanced') {
            optimized = this.addExamples(optimized);
            optimized = this.addChainOfThought(optimized);
            optimized = this.enhanceStructure(optimized);
        }

        // Calculate improvements
        const newAnalysis = PromptAnalyzer.analyze(optimized, model);
        
        return {
            original: originalPrompt,
            optimized: optimized,
            techniques: this.techniques,
            improvements: this.calculateImprovements(analysis, newAnalysis),
            newAnalysis: newAnalysis
        };
    },

    /**
     * Remove Redundancy (Context Engineering)
     */
    removeRedundancy(text) {
        let result = text;
        let removed = 0;

        // Remove repeated phrases
        const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s);
        const seen = new Set();
        const unique = sentences.filter(sentence => {
            const lower = sentence.toLowerCase();
            if (seen.has(lower)) {
                removed++;
                return false;
            }
            seen.add(lower);
            return true;
        });

        if (removed > 0) {
            result = unique.join('. ') + '.';
            this.techniques.push({
                name: 'Redundancy Removal',
                description: `Removed ${removed} repeated sentence(s)`,
                impact: 'Token efficiency improved'
            });
        }

        // Remove filler words
        const fillers = /\b(very|really|quite|basically|actually|literally|perhaps|maybe|possibly)\b\s*/gi;
        const fillerMatches = result.match(fillers);
        if (fillerMatches && fillerMatches.length > 0) {
            result = result.replace(fillers, '');
            this.techniques.push({
                name: 'Filler Word Removal',
                description: `Removed ${fillerMatches.length} filler word(s)`,
                impact: 'Signal density increased'
            });
        }

        return result;
    },

    /**
     * Improve Clarity
     */
    improveClarity(text) {
        let result = text;

        // Fix run-on sentences (very basic)
        result = result.replace(/\s+and\s+/g, ' and ');
        
        return result;
    },

    /**
     * Add Framework Structure (Anthropic 10-Component)
     */
    addFrameworkStructure(text) {
        const components = this.analysis.components;
        let result = text;
        let added = [];

        // Add Role if missing
        if (!components.role) {
            const role = this.inferRole(text);
            result = `[ROLE]: ${role}\n\n` + result;
            added.push('Role');
        }

        // Add Task header if not clear
        if (!components.task && !result.startsWith('[TASK]')) {
            result = result.replace(/^/, '[TASK]: ');
            added.push('Task Header');
        }

        // Add Output Format if missing
        if (!components.outputFormat) {
            const format = this.options.format || 'standard';
            const formatMap = {
                'standard': 'Markdown format with clear structure',
                'structured': 'Highly structured with sections and subsections',
                'article': 'Article-style prose with paragraphs',
                'bullets': 'Concise bullet points',
                'data': 'Valid JSON format'
            };
            result += `\n\n[OUTPUT FORMAT]: ${formatMap[format]}.`;
            added.push('Output Format');
        }

        // Add Constraints section if missing
        if (!components.constraints) {
            result += `\n\n[CONSTRAINTS]:\n`;
            
            if (this.options.concise) {
                result += `- Be concise and direct\n`;
            }
            if (this.options.noPreamble) {
                result += `- No preamble, go straight to the answer\n`;
            }
            
            result += `- Ensure accuracy and relevance\n`;
            added.push('Constraints');
        }

        // Add NEVER section for negative constraints
        if (this.analysis.contextEngineering.altitude === 'too-high') {
            result += `\n\n[NEVER]:\n`;
            result += `- Don't be vague or use filler language\n`;
            result += `- Don't make assumptions without stating them\n`;
            added.push('Negative Constraints');
        }

        if (added.length > 0) {
            this.techniques.push({
                name: 'Framework Structure',
                description: `Added: ${added.join(', ')}`,
                impact: 'Follows Anthropic 10-component framework'
            });
        }

        return result;
    },

    inferRole(text) {
        const lower = text.toLowerCase();
        
        if (lower.includes('code') || lower.includes('program')) {
            return 'You are a Senior Software Engineer with expertise in writing clean, production-ready code';
        }
        if (lower.includes('write') || lower.includes('article')) {
            return 'You are an expert writer skilled at crafting clear, engaging content';
        }
        if (lower.includes('analyze') || lower.includes('data')) {
            return 'You are a Data Analyst with expertise in extracting insights from information';
        }
        if (lower.includes('design')) {
            return 'You are a UX/UI Designer with expertise in user-centered design';
        }
        
        return 'You are an expert assistant focused on delivering high-quality, accurate responses';
    },

    /**
     * Correct Altitude
     */
    correctAltitude(text) {
        const altitude = this.analysis.contextEngineering.altitude;
        
        if (altitude === 'too-low') {
            return this.raiseAltitude(text);
        } else if (altitude === 'too-high') {
            return this.lowerAltitude(text);
        }
        
        return text;
    },

    raiseAltitude(text) {
        let result = text;
        
        // Convert hardcoded steps to principles
        result = result.replace(/step \d+:/gi, '•');
        result = result.replace(/first.*?then.*?finally/gi, (match) => {
            return 'Follow a logical progression: ' + match.replace(/first|then|finally/gi, '').trim();
        });

        this.techniques.push({
            name: 'Altitude Correction',
            description: 'Raised from too-low (hardcoded) to principle-based',
            impact: 'More flexible and generalizable'
        });

        return result;
    },

    lowerAltitude(text) {
        let result = text;
        
        // Add concrete specifics to vague requests
        result = result.replace(/be professional/gi, 'use formal business language with proper structure');
        result = result.replace(/be helpful/gi, 'provide clear, actionable guidance with specific examples');
        result = result.replace(/be creative/gi, 'explore unconventional approaches and present multiple options');
        result = result.replace(/do your best/gi, 'prioritize accuracy and completeness');

        this.techniques.push({
            name: 'Altitude Correction',
            description: 'Lowered from too-high (vague) to specific guidance',
            impact: 'Clearer expectations and better results'
        });

        return result;
    },

    /**
     * Apply Model-Specific Rules
     */
    applyModelSpecificRules(text) {
        const modelRules = {
            claude: this.applyClaudeRules,
            gpt: this.applyGPTRules,
            gemini: this.applyGeminiRules
        };

        const applier = modelRules[this.model] || modelRules.claude;
        return applier.call(this, text);
    },

    applyClaudeRules(text) {
        let result = text;
        const applied = [];

        // Add explicit "go beyond" for creative tasks
        if (PromptAnalyzer.isCreativeTask(text) && !PromptAnalyzer.hasExplicitRequest(text)) {
            result += `\n\nGo beyond the basics. Include as many relevant details and nuances as possible to create a comprehensive, fully-featured response.`;
            applied.push('Explicit "go beyond" request');
        }

        // Add thinking block for analytical tasks
        if (PromptAnalyzer.isAnalyticalTask(text) && !/<thinking>/i.test(text)) {
            result += `\n\nBefore providing your final answer, analyze the problem in a <thinking> block, considering different approaches and potential issues.`;
            applied.push('Thinking block for analysis');
        }

        // Add motivation context if missing
        if (text.length > 200 && !text.toLowerCase().includes('because') && !text.toLowerCase().includes('this is important')) {
            // Find a good place to add context
            const firstConstraint = result.indexOf('[CONSTRAINTS]');
            if (firstConstraint > -1) {
                const insert = '\n\nNote: These constraints are important because they ensure the output meets specific quality and usability standards.\n';
                result = result.slice(0, firstConstraint + 13) + insert + result.slice(firstConstraint + 13);
                applied.push('Motivation context');
            }
        }

        if (applied.length > 0) {
            this.techniques.push({
                name: 'Claude 4.x Optimization',
                description: applied.join(', '),
                impact: 'Optimized for Claude 4.5 Opus/Sonnet'
            });
        }

        return result;
    },

    applyGPTRules(text) {
        let result = text;
        const applied = [];

        // Add step-by-step if not present
        if (!PromptAnalyzer.hasChainOfThought(text)) {
            result += `\n\nThink through this step-by-step before providing your final answer.`;
            applied.push('Step-by-step reasoning');
        }

        if (applied.length > 0) {
            this.techniques.push({
                name: 'GPT-5 Optimization',
                description: applied.join(', '),
                impact: 'Optimized for GPT-5'
            });
        }

        return result;
    },

    applyGeminiRules(text) {
        let result = text;
        const applied = [];

        // Add grounding
        if (!text.toLowerCase().includes('context') && text.length < 100) {
            result = `[CONTEXT]: Provide a response based on your training data and general knowledge.\n\n` + result;
            applied.push('Grounding context');
        }

        if (applied.length > 0) {
            this.techniques.push({
                name: 'Gemini 3 Optimization',
                description: applied.join(', '),
                impact: 'Optimized for Gemini 3'
            });
        }

        return result;
    },

    /**
     * Add Examples (Advanced)
     */
    addExamples(text) {
        // Only add if missing and task is suitable
        if (this.analysis.components.examples) {
            return text;
        }

        let result = text;
        const lower = text.toLowerCase();

        // Add example for format specification
        if (lower.includes('format') && !lower.includes('example')) {
            result += `\n\n[EXAMPLE]:\nFor reference, structure your output similar to:\n- Clear introduction\n- Main content organized logically\n- Concise conclusion`;
            
            this.techniques.push({
                name: 'Examples Added',
                description: 'Added structural example',
                impact: 'Clarifies expected format'
            });
        }

        return result;
    },

    /**
     * Add Chain-of-Thought (Advanced)
     */
    addChainOfThought(text) {
        if (PromptAnalyzer.hasChainOfThought(text)) {
            return text;
        }

        let result = text;

        if (PromptAnalyzer.isAnalyticalTask(text) || text.length > 300) {
            result += `\n\nThink through this systematically:\n1. Understand the core requirements\n2. Consider different approaches\n3. Evaluate trade-offs\n4. Provide your recommended solution`;
            
            this.techniques.push({
                name: 'Chain-of-Thought Added',
                description: 'Added reasoning framework',
                impact: 'Improves analytical quality'
            });
        }

        return result;
    },

    /**
     * Enhance Structure with XML (Advanced)
     */
    enhanceStructure(text) {
        // If already has XML, don't add more
        if (PromptAnalyzer.hasXMLStructure(text)) {
            return text;
        }

        // Convert bracket sections to XML
        let result = text.replace(/\[ROLE\]:/gi, '<role>\n');
        result = result.replace(/\[TASK\]:/gi, '</role>\n\n<task>');
        result = result.replace(/\[OUTPUT FORMAT\]:/gi, '</task>\n\n<output_format>');
        result = result.replace(/\[CONSTRAINTS\]:/gi, '</output_format>\n\n<constraints>');
        
        // Close any opened tags
        if (result.includes('<constraints>') && !result.includes('</constraints>')) {
            result += '\n</constraints>';
        }

        if (result !== text) {
            this.techniques.push({
                name: 'XML Structure',
                description: 'Converted to XML format for better parsing',
                impact: 'Clearer structure for AI'
            });
        }

        return result;
    },

    /**
     * Calculate Improvements
     */
    calculateImprovements(oldAnalysis, newAnalysis) {
        const scoreChange = newAnalysis.overallScore.score - oldAnalysis.overallScore.score;
        const efficiencyChange = newAnalysis.contextEngineering.tokenEfficiency.efficiency - 
                                oldAnalysis.contextEngineering.tokenEfficiency.efficiency;
        const tokenChange = newAnalysis.tokenCount - oldAnalysis.tokenCount;

        // Calculate cost (approximation for Claude)
        const costPerToken = 0.000003; // $3 per million tokens (input)
        const originalCost = oldAnalysis.tokenCount * costPerToken;
        const optimizedCost = newAnalysis.tokenCount * costPerToken;
        const costChange = optimizedCost - originalCost;

        return {
            scoreChange: Math.round(scoreChange * 10) / 10,
            scorePercent: oldAnalysis.overallScore.score > 0 ? 
                Math.round((scoreChange / oldAnalysis.overallScore.score) * 100) : 0,
            efficiencyChange: Math.round(efficiencyChange),
            tokenChange: tokenChange,
            tokenPercent: oldAnalysis.tokenCount > 0 ? 
                Math.round((tokenChange / oldAnalysis.tokenCount) * 100) : 0,
            costPerCall: Math.abs(costChange).toFixed(6),
            costPer1000: Math.abs(costChange * 1000).toFixed(2),
            costPerYear: Math.abs(costChange * 1000 * 365).toFixed(2),
            isBetter: scoreChange > 0
        };
    }
};

// Make it available globally
window.PromptOptimizer = PromptOptimizer;
