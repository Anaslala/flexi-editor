import { Icons } from '../ui/Icons';

export class FindReplacePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'FindReplace';
        this.isOpen = false;
        this.currentMatches = [];
        this.currentIndex = -1;
        this.highlightClass = 'editor-search-highlight';
        this.activeClass = 'editor-search-active';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('findReplace', {
            title: 'Find and Replace',
            icon: Icons.search,
            command: 'findReplace',
            onAction: () => this.toggleDialog()
        });

        this.createDialog();
        this.addStyles();
    }

    addStyles() {
        // Add CSS for highlighting
        if (!document.getElementById('editor-find-replace-styles')) {
            const style = document.createElement('style');
            style.id = 'editor-find-replace-styles';
            style.textContent = `
                .editor-search-highlight {
                    background: #fff59d;
                    color: #000;
                    border-radius: 2px;
                }
                .editor-search-active {
                    background: #ffb300;
                    color: #000;
                    font-weight: 600;
                    border-radius: 2px;
                }
                .editor-find-replace {
                    position: absolute;
                    top: 60px;
                    right: 20px;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    min-width: 400px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .editor-find-replace input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: border-color 0.2s ease;
                }
                .editor-find-replace input:focus {
                    outline: none;
                    border-color: #1b9af7;
                    box-shadow: 0 0 0 3px rgba(27, 154, 247, 0.1);
                }
                .editor-find-replace input::placeholder {
                    color: #9ca3af;
                }
                .editor-find-replace button {
                    padding: 7px 14px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: white;
                    color: #374151;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.15s ease;
                }
                .editor-find-replace button:hover {
                    background: #f9fafb;
                    border-color: #9ca3af;
                }
                .editor-find-replace button:active {
                    background: #f3f4f6;
                }
                .editor-find-replace .nav-btn {
                    min-width: 36px;
                    height: 36px;
                    padding: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .editor-find-replace .replace-btn {
                    background: #1b9af7;
                    color: white;
                    border-color: #1b9af7;
                }
                .editor-find-replace .replace-btn:hover {
                    background: #1886d6;
                    border-color: #1886d6;
                }
                .editor-find-replace .replace-all-btn {
                    background: white;
                    color: #1b9af7;
                    border-color: #1b9af7;
                }
                .editor-find-replace .replace-all-btn:hover {
                    background: #eff6ff;
                }
                .editor-find-replace .find-replace-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                    align-items: center;
                }
                .editor-find-replace .find-replace-row:last-of-type {
                    margin-bottom: 8px;
                }
                .editor-find-replace .find-replace-info {
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 8px;
                    padding: 6px 10px;
                    background: #f9fafb;
                    border-radius: 4px;
                    text-align: center;
                }
                .editor-find-replace .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: transparent;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #9ca3af;
                    padding: 4px;
                    width: 28px;
                    height: 28px;
                    line-height: 20px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.15s ease;
                }
                .editor-find-replace .close-btn:hover {
                    background: #f3f4f6;
                    color: #374151;
                }
                .editor-find-replace .input-wrapper {
                    flex: 1;
                }
            `;
            document.head.appendChild(style);
        }
    }

    createDialog() {
        this.dialog = document.createElement('div');
        this.dialog.className = 'editor-find-replace';
        this.dialog.style.display = 'none';

        this.dialog.innerHTML = `
            <button class="close-btn" id="editor-find-close" title="Close">×</button>
            <div class="find-replace-row">
                <div class="input-wrapper">
                    <input type="text" id="editor-find-input" placeholder="Find">
                </div>
                <button class="nav-btn" id="editor-find-prev-btn" title="Previous">◀</button>
                <button class="nav-btn" id="editor-find-next-btn" title="Next">▶</button>
            </div>
            <div class="find-replace-row">
                <div class="input-wrapper">
                    <input type="text" id="editor-replace-input" placeholder="Replace">
                </div>
                <button class="replace-btn" id="editor-replace-btn">Replace</button>
                <button class="replace-all-btn" id="editor-replace-all-btn">Replace All</button>
            </div>
            <div class="find-replace-info" id="editor-find-info"></div>
        `;

        this.editor.element.appendChild(this.dialog);
        this.bindEvents();
    }

    bindEvents() {
        const findInput = this.dialog.querySelector('#editor-find-input');
        const replaceInput = this.dialog.querySelector('#editor-replace-input');
        const prevBtn = this.dialog.querySelector('#editor-find-prev-btn');
        const nextBtn = this.dialog.querySelector('#editor-find-next-btn');
        const replaceBtn = this.dialog.querySelector('#editor-replace-btn');
        const replaceAllBtn = this.dialog.querySelector('#editor-replace-all-btn');
        const closeBtn = this.dialog.querySelector('#editor-find-close');
        const infoDiv = this.dialog.querySelector('#editor-find-info');

        // Search on input
        findInput.addEventListener('input', () => {
            const query = findInput.value;
            if (query) {
                this.search(query);
            } else {
                this.clearHighlights();
            }
        });

        // Previous match
        prevBtn.onclick = () => {
            this.navigateToPrevious();
        };

        // Next match
        nextBtn.onclick = () => {
            this.navigateToNext();
        };

        // Replace current
        replaceBtn.onclick = () => {
            const replacement = replaceInput.value;
            this.replaceCurrent(replacement);
        };

        // Replace all
        replaceAllBtn.onclick = () => {
            const replacement = replaceInput.value;
            this.replaceAll(replacement);
        };

        // Close dialog
        closeBtn.onclick = () => {
            this.toggleDialog();
        };

        // Enter key to find next
        findInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.navigateToNext();
            }
        });
    }

    search(query) {
        this.clearHighlights();
        this.currentMatches = [];
        this.currentIndex = -1;

        if (!query) return;

        const content = this.editor.contentArea;
        this.highlightText(content, query);

        this.updateInfo();

        if (this.currentMatches.length > 0) {
            this.currentIndex = 0;
            this.highlightCurrent();
        }
    }

    highlightText(node, query) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const lowerText = text.toLowerCase();
            const lowerQuery = query.toLowerCase();
            let index = lowerText.indexOf(lowerQuery);

            if (index !== -1) {
                const parent = node.parentNode;
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                while (index !== -1) {
                    // Text before match
                    if (index > lastIndex) {
                        fragment.appendChild(
                            document.createTextNode(text.substring(lastIndex, index))
                        );
                    }

                    // Highlighted match
                    const span = document.createElement('span');
                    span.className = this.highlightClass;
                    span.textContent = text.substring(index, index + query.length);
                    span.setAttribute('data-search-match', 'true');
                    fragment.appendChild(span);
                    this.currentMatches.push(span);

                    lastIndex = index + query.length;
                    index = lowerText.indexOf(lowerQuery, lastIndex);
                }

                // Remaining text
                if (lastIndex < text.length) {
                    fragment.appendChild(
                        document.createTextNode(text.substring(lastIndex))
                    );
                }

                parent.replaceChild(fragment, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip script and style tags
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                return;
            }

            // Recursively search child nodes
            const children = Array.from(node.childNodes);
            children.forEach(child => this.highlightText(child, query));
        }
    }

    clearHighlights() {
        const highlights = this.editor.contentArea.querySelectorAll(`[data-search-match="true"]`);
        highlights.forEach(span => {
            const text = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(text, span);
        });

        // Normalize to merge adjacent text nodes
        this.editor.contentArea.normalize();

        this.currentMatches = [];
        this.currentIndex = -1;
        this.updateInfo();
    }

    highlightCurrent() {
        // Remove active class from all
        this.currentMatches.forEach(match => {
            match.classList.remove(this.activeClass);
        });

        // Add active class to current
        if (this.currentIndex >= 0 && this.currentIndex < this.currentMatches.length) {
            const current = this.currentMatches[this.currentIndex];
            current.classList.add(this.activeClass);

            // Scroll into view
            current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        this.updateInfo();
    }

    navigateToNext() {
        if (this.currentMatches.length === 0) return;

        this.currentIndex = (this.currentIndex + 1) % this.currentMatches.length;
        this.highlightCurrent();
    }

    navigateToPrevious() {
        if (this.currentMatches.length === 0) return;

        this.currentIndex = this.currentIndex - 1;
        if (this.currentIndex < 0) {
            this.currentIndex = this.currentMatches.length - 1;
        }
        this.highlightCurrent();
    }

    replaceCurrent(replacement) {
        if (this.currentIndex < 0 || this.currentIndex >= this.currentMatches.length) {
            return;
        }

        const current = this.currentMatches[this.currentIndex];
        const textNode = document.createTextNode(replacement);
        current.parentNode.replaceChild(textNode, current);

        // Remove from matches array
        this.currentMatches.splice(this.currentIndex, 1);

        // Adjust index
        if (this.currentIndex >= this.currentMatches.length) {
            this.currentIndex = this.currentMatches.length - 1;
        }

        this.updateInfo();

        if (this.currentMatches.length > 0) {
            this.highlightCurrent();
        }

        // Trigger change event
        this.editor.trigger('change');
    }

    replaceAll(replacement) {
        if (this.currentMatches.length === 0) return;

        const count = this.currentMatches.length;

        // Replace all matches
        this.currentMatches.forEach(match => {
            const textNode = document.createTextNode(replacement);
            match.parentNode.replaceChild(textNode, match);
        });

        this.currentMatches = [];
        this.currentIndex = -1;
        this.updateInfo();

        // Show success message
        const infoDiv = this.dialog.querySelector('#editor-find-info');
        infoDiv.textContent = `Replaced ${count} occurrence${count !== 1 ? 's' : ''}`;

        setTimeout(() => {
            this.updateInfo();
        }, 2000);

        // Trigger change event
        this.editor.trigger('change');
    }

    updateInfo() {
        const infoDiv = this.dialog.querySelector('#editor-find-info');

        if (this.currentMatches.length === 0) {
            infoDiv.textContent = 'No matches found';
        } else {
            infoDiv.textContent = `Match ${this.currentIndex + 1} of ${this.currentMatches.length}`;
        }
    }

    toggleDialog() {
        this.isOpen = !this.isOpen;
        this.dialog.style.display = this.isOpen ? 'block' : 'none';

        if (this.isOpen) {
            const findInput = this.dialog.querySelector('#editor-find-input');
            findInput.focus();
            findInput.select();
        } else {
            this.clearHighlights();
        }
    }

    destroy() {
        this.clearHighlights();
        if (this.dialog && this.dialog.parentNode) {
            this.dialog.parentNode.removeChild(this.dialog);
        }
    }
}
