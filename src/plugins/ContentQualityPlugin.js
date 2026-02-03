import { Icons } from '../ui/Icons';

export class ContentQualityPlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'ContentQuality';
        this.options = {
            minWords: 0,
            maxWords: 0,
            requiredHeadings: ['h1'],
            ...options
        };
        this.sidebar = null;
        this.stats = {
            words: 0,
            chars: 0,
            readingTime: 0,
            headings: {},
            issues: []
        };
    }

    init() {
        this.createSidebar();

        // Add toolbar button to toggle quality panel
        this.editor.toolbar.registerButton('contentQuality', {
            title: 'Content Quality & SEO',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
            action: () => this.toggleSidebar()
        });

        // Real-time analysis with debounce
        let timer;
        this.editor.on('change', () => {
            clearTimeout(timer);
            timer = setTimeout(() => this.analyze(), 500);
        });

        // Initial analysis
        setTimeout(() => this.analyze(), 100);
    }

    createSidebar() {
        this.sidebar = document.createElement('div');
        this.sidebar.className = 'editor-quality-sidebar';
        this.sidebar.style.cssText = `
            position: fixed;
            top: 0;
            right: -300px;
            width: 300px;
            height: 100%;
            background: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            z-index: 10001;
            transition: right 0.3s ease;
            display: flex;
            flex-direction: column;
            border-left: 1px solid #eee;
            font-family: sans-serif;
        `;

        // content will be built in updateSidebar
        document.body.appendChild(this.sidebar);
    }

    toggleSidebar() {
        const isVisible = this.sidebar.style.right === '0px';
        this.sidebar.style.right = isVisible ? '-300px' : '0px';
        if (!isVisible) this.analyze();
    }

    analyze() {
        const content = this.editor.getData();
        const doc = new DOMParser().parseFromString(content, 'text/html');
        const text = doc.body.textContent || '';

        // 1. Basic Stats
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        this.stats.words = words;
        this.stats.chars = text.length;
        this.stats.readingTime = Math.ceil(words / 200); // 200 words per minute

        // 2. Headings Analysis
        this.stats.headings = {
            h1: doc.querySelectorAll('h1').length,
            h2: doc.querySelectorAll('h2').length,
            h3: doc.querySelectorAll('h3').length,
            h4: doc.querySelectorAll('h4').length,
        };

        // 3. Issues Detection
        this.stats.issues = [];

        // Rule: Heading Hierarchy
        if (this.stats.headings.h1 === 0) {
            this.stats.issues.push({ type: 'error', message: 'Missing H1 title tag' });
        } else if (this.stats.headings.h1 > 1) {
            this.stats.issues.push({ type: 'warning', message: 'Multiple H1 tags found (recommended: 1)' });
        }

        const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let lastLevel = 0;
        headings.forEach(h => {
            const level = parseInt(h.tagName[1]);
            if (level > lastLevel + 1) {
                this.stats.issues.push({ type: 'warning', message: `Skipped heading level: H${lastLevel} to H${level}` });
            }
            lastLevel = level;
        });

        // Rule: Word Limits
        if (this.options.minWords > 0 && words < this.options.minWords) {
            this.stats.issues.push({ type: 'error', message: `Content too short (Min: ${this.options.minWords} words)` });
        }
        if (this.options.maxWords > 0 && words > this.options.maxWords) {
            this.stats.issues.push({ type: 'error', message: `Content too long (Max: ${this.options.maxWords} words)` });
        }

        // Rule: Repeated words (basic)
        const repeated = text.match(/\b(\w+)\s+\1\b/gi);
        if (repeated) {
            repeated.forEach(w => {
                this.stats.issues.push({ type: 'warning', message: `Repeated word: "${w}"` });
            });
        }

        // Rule: Empty Blocks (simplified)
        // Check for empty paragraphs?

        this.updateSidebarUI();
    }

    updateSidebarUI() {
        if (!this.sidebar) return;

        const getIconStr = (type) => type === 'error' ? '🔴' : '⚠️';

        this.sidebar.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Content Quality</h3>
                <button style="border: none; background: none; cursor: pointer; font-size: 20px;" onclick="this.closest('.editor-quality-sidebar').style.right = '-300px'">&times;</button>
            </div>
            
            <div style="padding: 16px; flex: 1; overflow-y: auto;">
                <div style="margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                         <div style="background: #f9f9f9; padding: 10px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #333;">${this.stats.words}</div>
                            <div style="font-size: 12px; color: #666;">Words</div>
                         </div>
                         <div style="background: #f9f9f9; padding: 10px; border-radius: 6px; text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #333;">${this.stats.readingTime}m</div>
                            <div style="font-size: 12px; color: #666;">Read Time</div>
                         </div>
                    </div>
                    <div style="font-size: 12px; color: #666; text-align: center;">
                        ${this.stats.chars} characters
                    </div>
                </div>

                <h4 style="font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 4px;">SEO Checks</h4>
                <div style="margin-bottom: 20px;">
                    ${this.stats.issues.length === 0
                ? '<div style="color: green; font-size: 13px;">✅ All checks passed</div>'
                : this.stats.issues.map(issue => `
                            <div style="margin-bottom: 8px; font-size: 13px; color: #444; background: ${issue.type === 'error' ? '#fff0f0' : '#fff9e6'}; padding: 8px; border-radius: 4px; border-left: 3px solid ${issue.type === 'error' ? 'red' : 'orange'};">
                                ${getIconStr(issue.type)} ${issue.message}
                            </div>
                        `).join('')}
                </div>

                <h4 style="font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 4px;">Structure</h4>
                 <div style="font-size: 13px; color: #555;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>H1</span> <span>${this.stats.headings.h1}</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>H2</span> <span>${this.stats.headings.h2}</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;"><span>H3</span> <span>${this.stats.headings.h3}</span></div>
                </div>
            </div>
        `;
    }
}
