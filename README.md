# Prompt Optimizer V2 🚀

**Professional AI Prompt Engineering Tool**  
Built with vanilla HTML/CSS/JavaScript • Based on Anthropic's 2026 Research • Ready for GitHub Pages

---

## 🎯 What's New in V2

### Major Enhancements

- **Real-Time Analysis Engine**  
  - Token counting (approximation for all models)
  - Anthropic's 10-component framework checker
  - Context engineering metrics (efficiency, signal density, altitude)
  - Model-specific compatibility scoring

- **Smart Optimization Engine**  
  - Removes redundancy and filler words
  - Adds missing framework components
  - Corrects altitude (too-low/too-high/just-right)
  - Applies model-specific optimizations (Claude 4.x, GPT-5, Gemini 3)

- **Enhanced UX**  
  - Progressive disclosure (grandma-friendly + power-user modes)
  - Before/after side-by-side comparison
  - Cost savings calculator ($ per call)
  - Technique explanations with tooltips
  - Dark/light theme toggle

- **Prompt Library**  
  - Save optimized prompts to localStorage
  - Search and filter
  - One-click reload

---

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. Fork this repository
2. Go to Settings → Pages
3. Set source to `main` branch, `/` root
4. Access at `https://yourusername.github.io/prompt-optimizer/`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-optimizer.git
cd prompt-optimizer

# Open index.html in your browser
# (No build step needed - it's pure HTML/CSS/JS!)
open index.html
```

That's it! No dependencies, no build tools, no npm install.

---

## 📁 File Structure

```
prompt-optimizer-v2/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling (dark/light themes)
├── app.js              # Main application controller
├── analyzer.js         # Prompt analysis engine
├── optimizer.js        # Prompt optimization engine
├── models.js           # Model definitions & tooltip content
└── README.md           # This file
```

**Total Size:** ~110 KB (uncompressed)  
**Dependencies:** None (uses CDN for Lucide icons only)

---

## 🎨 Features in Detail

### 1. Real-Time Analysis

As you type, see instant feedback on:

- **Overall Score** (0-10) - Comprehensive quality metric
- **Token Efficiency** - % of useful vs filler tokens
- **Signal Density** - High-value word ratio
- **Altitude** - Balance between vague and over-specified
- **Components** - Which framework elements are present/missing

### 2. Smart Optimization

Three optimization levels:

- **Quick Fix** (~30 sec) - Basic cleanup
- **Standard** (recommended) - Full framework optimization
- **Advanced** - Maximum quality with examples & CoT

Techniques applied:
- Redundancy removal (context engineering)
- Altitude correction (vague → specific → just-right)
- Framework completion (adds missing components)
- Model-specific enhancements (Claude 4.x, GPT, Gemini)

### 3. Before/After Comparison

See exactly what changed:
- Side-by-side view
- Token count comparison
- Cost impact calculation
- Technique explanations

### 4. Prompt Library

Save your best prompts:
- Stored in browser localStorage
- Search and filter
- Load with one click
- Export/import capability

---

## 🧠 The Science Behind It

### Based on Anthropic's Research

V2 implements:

1. **10-Component Framework** (Anthropic official)
   - Role/Persona
   - Tone Context
   - Background Data
   - Task Description
   - Examples
   - Chain-of-Thought
   - Output Format
   - Constraints
   - Response Prefill
   - XML Structure

2. **Context Engineering** (Dec 2025 guidance)
   - Token efficiency optimization
   - Signal density maximization
   - Attention budget management
   - Redundancy elimination

3. **Altitude Correction** (Critical for Claude 4.x)
   - Too Low: Hardcoded, brittle logic
   - Too High: Vague, no concrete guidance
   - Just Right: Principle-based, specific but flexible

4. **Model-Specific Optimizations**
   - **Claude 4.x:** Explicit requests, motivation context, thinking blocks
   - **GPT-5:** Step-by-step reasoning, format specification
   - **Gemini 3:** Grounding, boundary setting

---

## 💡 Usage Tips

### For Beginners

1. **Start Simple:** Just type what you want
2. **Follow the wizard:** Answer 2-3 refinement questions
3. **Choose Standard:** Let the optimizer do its magic
4. **Copy & use:** Your prompt is ready!

### For Power Users

1. **Toggle "Show Details":** See all metrics
2. **Use Advanced mode:** Get maximum optimization
3. **Experiment with levels:** Compare quick vs standard vs advanced
4. **Save to library:** Build your prompt collection
5. **Study techniques:** Learn what improvements were made

---

## 🎯 Example Transformation

**Original Prompt (Score: 3.5/10):**
```
Write me a professional email to my boss asking for a raise
```

**Optimized Prompt (Score: 9.1/10):**
```
[ROLE]: You are a professional business communication expert.

[TASK]: Write a formal email requesting a salary review and increase.

[CONTEXT]:
- Employment duration: 3 years
- Company status: Profitable and growing
- Reason: Performance-based achievements

[REQUIRED ELEMENTS]:
1. Professional greeting
2. Clear purpose statement
3. 2-3 specific achievements with metrics
4. Market research reference (1 sentence)
5. Meeting request
6. Professional closing

[CONSTRAINTS]:
- Length: 200-300 words
- Tone: Assertive but respectful
- Format: Standard business email

[NEVER]:
- Don't use entitled language
- Don't make ultimatums
- Don't compare to colleagues

[OUTPUT FORMAT]: Business email with subject line and sign-off.
```

**Improvements:**
- Score: +5.6 points (+160%)
- Efficiency: +49 percentage points
- Cost per call: $0.0034 (but saves 2-3 revisions)

---

## 🔧 Customization

### Modify Model Pricing

Edit `models.js`:

```javascript
const ModelData = {
    claude: {
        pricing: {
            input: 3.00,  // $ per million tokens
            output: 15.00
        }
    }
    // ... update as needed
};
```

### Add New Tooltips

Edit `models.js`:

```javascript
const TooltipContent = {
    'your-metric': {
        title: 'Your Metric',
        description: 'What it means...',
        example: { poor: '...', good: '...' }
    }
};
```

### Customize Themes

Edit CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #6366f1;  /* Change primary color */
    --accent-secondary: #8b5cf6;
    /* ... more variables */
}
```

---

## 🐛 Troubleshooting

### Prompt Not Optimizing

- Check browser console for errors
- Ensure all JS files are loaded
- Try refreshing the page

### Library Not Saving

- Check localStorage is enabled
- Browser must support localStorage
- Private/incognito mode may restrict storage

### Icons Not Showing

- Check internet connection (Lucide CDN)
- Check console for CDN errors
- Icons load from: `https://unpkg.com/lucide@0.400.0`

---

## 📊 Performance

- **Initial Load:** < 1 second
- **Analysis:** Real-time (< 100ms)
- **Optimization:** < 500ms (instant feel)
- **Memory Usage:** ~5-10 MB
- **Storage:** LocalStorage only (5MB limit)

---

## 🛠️ Technical Details

### Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Technologies Used

- **HTML5:** Semantic markup
- **CSS3:** Custom properties, Grid, Flexbox
- **JavaScript (ES6+):** Classes, modules pattern
- **LocalStorage:** Persistent prompt library
- **Lucide Icons:** Via CDN

### No Build Tools Required

This is intentional! The goal is simplicity:
- No npm
- No webpack/vite/parcel
- No transpilation
- Just static files

---

## 📚 Resources

### Official Documentation

- [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Claude 4.x Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google Gemini Prompting](https://ai.google.dev/gemini-api/docs/prompting-intro)

### Learn More

- Context Engineering: [Anthropic Blog](https://www.anthropic.com/blog)
- Prompt Patterns: [Prompt Engineering Guide](https://www.promptingguide.ai/)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contributions

- [ ] Add more model adapters (Mistral, Llama, etc.)
- [ ] Implement export to multiple formats (JSON, YAML, etc.)
- [ ] Add A/B testing mode (compare two prompts)
- [ ] Build batch optimization feature
- [ ] Create browser extension version
- [ ] Add more example transformations
- [ ] Implement prompt versioning
- [ ] Add collaborative features (share prompts)

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- **Anthropic** for Claude and comprehensive documentation
- **OpenAI** for GPT models and research
- **Google** for Gemini and prompting guides
- **Lucide** for beautiful open-source icons

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/prompt-optimizer/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/prompt-optimizer/discussions)
- **Email:** your.email@example.com

---

## 🗺️ Roadmap

### Completed ✅
- [x] Real-time analysis
- [x] Multi-level optimization
- [x] Prompt library
- [x] Cost calculator
- [x] Dark/light themes
- [x] Mobile responsive

### Planned 🚧
- [ ] Batch optimization
- [ ] Version history
- [ ] Export formats (JSON, YAML)
- [ ] Prompt templates gallery
- [ ] API endpoint (optional)
- [ ] Browser extension

### Future 💡
- [ ] AI-powered suggestions
- [ ] Collaborative prompt editing
- [ ] Integration with popular tools
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for the AI community**

*Last updated: January 29, 2026*
