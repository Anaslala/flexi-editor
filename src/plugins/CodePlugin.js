import { Icons } from '../ui/Icons';

/**
 * CodePlugin
 * 
 * Advanced Code Block with:
 * - Language Selection
 * - Copy to Clipboard
 * - Line Numbers (Visual)
 */
export class CodePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Code';
    }

    init() {
        // Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            .fe-code-block {
                margin: 20px 0;
                background: #0d1117; /* GitHub Dark Dimmed */
                border-radius: 8px;
                overflow: hidden;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                border: 1px solid #30363d;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            .fe-code-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 16px;
                background: #161b22;
                border-bottom: 1px solid #30363d;
            }
            .fe-lang-select {
                background: #0d1117;
                color: #c9d1d9;
                border: 1px solid #30363d;
                border-radius: 6px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                outline: none;
            }
            .fe-code-content {
                padding: 20px;
                background-color: #0d1117 !important; /* Force dark background */
                color: #e6edf3 !important; /* Force light text */
                font-size: 14px;
                line-height: 1.6;
                font-family: inherit;
                margin: 0;
                white-space: pre-wrap;
                outline: none;
                tab-size: 4;
                border-top: 1px solid #30363d;
            }
            .fe-code-content * {
                background-color: transparent !important; /* Prevent white backgrounds on spans */
                font-family: inherit;
            }
            .fe-code-content::selection, .fe-code-content *::selection {
                background: #264f78 !important; /* VS Code selections */
                color: white !important;
            }

            /* Syntax Highlighting Token Classes */
            .fe-token-keyword { color: #ff7b72 !important; font-weight: bold; }
            .fe-token-string { color: #a5d6ff !important; } /* Lighter blue/green for better contrast */
            .fe-token-comment { color: #8b949e !important; font-style: italic; }
            .fe-token-number { color: #79c0ff !important; }
            .fe-token-boolean { color: #ffa657 !important; }
            .fe-token-function { color: #d2a8ff !important; }
            .fe-token-class { color: #ffa657 !important; }
        `;
        document.head.appendChild(style);

        // Register Toolbar Button
        if (this.editor.toolbar) {
            this.editor.toolbar.registerButton('codeBlock', {
                title: 'Code Block',
                icon: Icons.code,
                command: 'formatBlock',
                onAction: (editor) => {
                    this.insertCodeBlock();
                }
            });
        }

        // Global Event Delegation for Copy (Fallback)
        this.editor.contentArea.addEventListener('click', (e) => {
            // Use closest to catch clicks on icon inside button (if any)
            const copyBtn = e.target.closest('.fe-code-copy');
            if (copyBtn) {
                // Stop editor from losing selection or doing weird things
                e.preventDefault();
                e.stopPropagation();
                this.handleCopy(copyBtn);
            }
        });

        // Listen for Backspace
        this.editor.contentArea.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace') {
                this.handleBackspace(e);
            }
            if (e.key === 'Tab' && e.target.closest('.fe-code-block')) {
                e.preventDefault();
                document.execCommand('insertText', false, '    ');
            }
        });

        // Re-bind (Highlighting)
        setTimeout(() => {
            this.editor.contentArea.querySelectorAll('.fe-code-block').forEach(block => {
                this.bindBlockEvents(block);
            });
        }, 1000);
    }

    insertCodeBlock(language = 'javascript') {
        const block = document.createElement('div');
        block.className = 'fe-code-block';
        block.contentEditable = 'false';

        block.innerHTML = `
            <div class="fe-code-header">
                <div style="display:flex; gap:8px;">
                    <select class="fe-lang-select">
                        <option value="javascript" ${language === 'javascript' ? 'selected' : ''}>JavaScript</option>
                        <option value="python" ${language === 'python' ? 'selected' : ''}>Python</option>
                        <option value="html" ${language === 'html' ? 'selected' : ''}>HTML</option>
                        <option value="css" ${language === 'css' ? 'selected' : ''}>CSS</option>
                        <option value="java" ${language === 'java' ? 'selected' : ''}>Java</option>
                        <option value="cpp" ${language === 'cpp' ? 'selected' : ''}>C++</option>
                    </select>
                </div>
            </div>
            <pre class="fe-code-content" contenteditable="true"><code>// Type code here...</code></pre>
        `;

        this.editor.execCommand('insertHTML', block.outerHTML + '<p><br></p>');

        setTimeout(() => {
            const newBlock = this.editor.contentArea.querySelector('.fe-code-block:last-of-type');
            if (newBlock) this.bindBlockEvents(newBlock);
        }, 50);
    }

    bindBlockEvents(block) {
        console.log('Binding events to block', block);
        const codeEl = block.querySelector('code');
        const selectEl = block.querySelector('.fe-lang-select');

        if (!codeEl) {
            console.error('Code element not found in block', block);
            return;
        }

        const getLang = () => selectEl ? selectEl.value : 'javascript';

        // Force Highlight immediately if content exists
        if (codeEl.innerText.length > 0 && codeEl.innerText.trim() !== '// Type code here...') {
            console.log('Initial highlight triggering');
            codeEl.innerHTML = this.highlightSyntax(codeEl.innerText, getLang());
        }

        // Highlight on blur
        codeEl.addEventListener('blur', () => {
            console.log('Blur event on code block');
            const text = codeEl.innerText;
            const lang = getLang();
            codeEl.innerHTML = this.highlightSyntax(text, lang);
        });

        // Remove highlight on focus (for clean editing)
        codeEl.addEventListener('focus', () => {
            console.log('Focus event - clearing highlight for edit');
            codeEl.textContent = codeEl.innerText;
        });

        // Bind Select change manually if needed (delegation covers clicks but change might not bubble)
        if (selectEl) {
            selectEl.addEventListener('change', () => this.handleLanguageChange(selectEl));
        }
    }

    handleCopy(btn) {
        console.log('Copy Triggered');
        const block = btn.closest('.fe-code-block');
        const codeEl = block.querySelector('code');
        // Clean text: Replace NBSP, Zero-width space, etc.
        const code = codeEl.innerText
            .replace(/\u00A0/g, ' ')
            .replace(/[\u200B-\u200D\uFEFF]/g, '');

        const success = () => {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.borderColor = '#7ee787';
            btn.style.color = '#7ee787';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.borderColor = '#30363d';
                btn.style.color = '#c9d1d9';
            }, 2000);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(success).catch(() => this.copyFallback(code, success, () => btn.textContent = 'Err'));
        } else {
            this.copyFallback(code, success, () => btn.textContent = 'Err');
        }
    }

    // copyFallback logic
    copyFallback(text, onSuccess, onFail) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; // Avoid scrolling to bottom
            textarea.style.left = '-9999px';
            textarea.style.top = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (successful) onSuccess();
            else onFail(new Error('execCommand copy returned false'));
        } catch (e) {
            onFail(e);
        }
    }

    handleLanguageChange(selectEl) {
        console.log('Language changed:', selectEl.value);
        const block = selectEl.closest('.fe-code-block');
        const codeEl = block.querySelector('code');
        const text = codeEl.innerText;
        codeEl.innerHTML = this.highlightSyntax(text, selectEl.value);
    }

    handleBackspace(e) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        if (range.collapsed && range.startOffset === 0) {
            let node = range.startContainer;
            while (node && node !== this.editor.contentArea && node.nodeName !== 'DIV' && node.nodeName !== 'P') {
                node = node.parentNode;
            }
            if (node && node.previousElementSibling && node.previousElementSibling.classList.contains('fe-code-block')) {
                e.preventDefault();
                node.previousElementSibling.remove();
            }
        }
    }

    highlightSyntax(code, lang) {
        console.log(`Highlighting syntax for ${lang}. Length: ${code.length}`);
        // Robust Highlighting with Inline Styles (Sanitizer Off)
        code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const tokens = [];
        const saveToken = (content, style) => {
            tokens.push(`<span style="${style}">${content}</span>`);
            return `###TOKEN${tokens.length - 1}###`;
        };

        // Regex for Strings '...', "...", `...` (Standard + Smart Quotes)
        const stringRegex = /(['"`\u201C\u201D\u2018\u2019])(.*?)\1/g;

        const commentRegex = /(\/\/.*$|\#.*$)/gm;

        code = code.replace(commentRegex, match => saveToken(match, 'color:#8b949e !important; font-style:italic;'));
        code = code.replace(stringRegex, match => saveToken(match, 'color:#a5d6ff !important;'));

        const patterns = [
            // Keywords
            { regex: /\b(const|let|var|function|class|import|export|return|if|else|for|while|async|await|try|catch|new|this|super|extends|public|private|static|void|int|string|bool)\b/g, style: 'color:#ff7b72 !important; font-weight:bold;' },
            // Booleans
            { regex: /\b(true|false|null|undefined)\b/g, style: 'color:#ffa657 !important;' },
            // Functions
            { regex: /\b([a-zA-Z_]\w*)(?=\()/g, style: 'color:#d2a8ff !important;' },
            // Classes
            { regex: /\b[A-Z][a-zA-Z0-9_]*\b/g, style: 'color:#79c0ff !important;' },
            // Numbers
            { regex: /\b\d+(\.\d+)?\b/g, style: 'color:#79c0ff !important;' }
        ];

        patterns.forEach(({ regex, style }) => {
            code = code.replace(regex, match => `<span style="${style}">${match}</span>`);
        });

        // Restore
        code = code.replace(/###TOKEN(\d+)###/g, (match, id) => tokens[parseInt(id)]);
        return code;
    }
}
