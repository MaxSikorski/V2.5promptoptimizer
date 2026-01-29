/**
 * MODEL DEFINITIONS
 * Simple model-specific data
 */

const ModelData = {
    claude: {
        name: 'Claude 4.5',
        company: 'Anthropic',
        pricing: {
            input: 3.00,  // per million tokens
            output: 15.00
        },
        strengths: ['Long-horizon reasoning', 'Code generation', 'Analysis']
    },
    gpt: {
        name: 'GPT-5',
        company: 'OpenAI',
        pricing: {
            input: 5.00,
            output: 15.00
        },
        strengths: ['General purpose', 'Creative writing', 'Instruction following']
    },
    gemini: {
        name: 'Gemini 3',
        company: 'Google',
        pricing: {
            input: 2.50,
            output: 10.00
        },
        strengths: ['Multimodal', 'Research', 'Grounded responses']
    }
};

const TooltipContent = {
    'token-efficiency': {
        title: 'Token Efficiency',
        description: 'Percentage of tokens that contribute meaningful information vs. filler words.',
        example: {
            poor: '"Please help me write a really good email..."',
            good: '"Write a professional email requesting a raise. Include salary data."'
        },
        learnMore: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview'
    },
    'signal-density': {
        title: 'Signal Density',
        description: 'Ratio of high-value words (must, never, specific) to total words.',
        example: {
            low: 'Write something nice and creative',
            high: 'Write a 500-word article. Format: 3 paragraphs. Tone: professional.'
        }
    },
    'altitude': {
        title: 'Altitude',
        description: 'Balance between too vague (high altitude) and over-specified (low altitude).',
        details: [
            'Too High: "Be professional" → What does that mean?',
            'Too Low: "If user says X, respond Y" → Too rigid',
            'Just Right: "Use formal tone, 200-300 words, structured" → Clear but flexible'
        ]
    },
    'components': {
        title: 'Components',
        description: "Based on Anthropic's 10-component framework for effective prompts.",
        list: [
            'Role/Persona',
            'Tone Context',
            'Background Data',
            'Task Description',
            'Examples',
            'Chain-of-Thought',
            'Output Format',
            'Constraints',
            'Response Prefill',
            'XML Structure'
        ]
    }
};

window.ModelData = ModelData;
window.TooltipContent = TooltipContent;
