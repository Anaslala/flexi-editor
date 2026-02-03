/**
 * TableOfContentsPlugin
 * 
 * Auto-generates a TOC from headings (H1-H6).
 * Updates automatically on content change.
 */

export class TableOfContentsPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'TableOfContents';
        this.tocElement = null;
        this.updateDebounce = null;
    }

    init() {
        // Listen for changes to update TOC if it exists
        this.editor.on('change', () => {
            if (this.tocElement) {
                clearTimeout(this.updateDebounce);
                this.updateDebounce = setTimeout(() => this.refreshTOC(), 1000);
            }
        });

        // Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            .fe-toc-block {
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                padding: 16px;
                margin: 24px 0;
                user-select: none;
            }
            .fe-toc-title {
                font-weight: 600;
                margin-bottom: 12px;
                color: #374151;
            }
            .fe-toc-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .fe-toc-item {
                margin-bottom: 4px;
            }
            .fe-toc-link {
                color: #2563eb;
                text-decoration: none;
                cursor: pointer;
            }
            .fe-toc-link:hover {
                text-decoration: underline;
            }
            .fe-toc-indent-1 { margin-left: 0px; }
            .fe-toc-indent-2 { margin-left: 16px; }
            .fe-toc-indent-3 { margin-left: 32px; }
            .fe-toc-indent-4 { margin-left: 48px; }
        `;
        document.head.appendChild(style);

        // Handle Clicks
        this.editor.contentArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('fe-toc-link')) {
                e.preventDefault();
                const targetId = e.target.dataset.target;
                const targetEl = this.editor.contentArea.querySelector(`#${targetId}`);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    insertTOC() {
        // Remove existing TOC if any
        const existing = this.editor.contentArea.querySelector('.fe-toc-block');
        if (existing) existing.remove();

        const tocContainer = document.createElement('div');
        tocContainer.className = 'fe-toc-block';
        tocContainer.contentEditable = 'false';
        tocContainer.innerHTML = `
            <div class="fe-toc-title">Table of Contents</div>
            <ul class="fe-toc-list">Loading...</ul>
        `;

        this.editor.execCommand('insertHTML', tocContainer.outerHTML + '<p><br></p>');

        // Re-query to get the inserted element
        setTimeout(() => {
            this.tocElement = this.editor.contentArea.querySelector('.fe-toc-block');
            this.refreshTOC();
        }, 50);
    }

    refreshTOC() {
        if (!this.tocElement) {
            // Try to find it again in case of reload/undo
            this.tocElement = this.editor.contentArea.querySelector('.fe-toc-block');
            if (!this.tocElement) return;
        }

        const headings = this.editor.contentArea.querySelectorAll('h1, h2, h3, h4');
        const list = this.tocElement.querySelector('.fe-toc-list');
        list.innerHTML = '';

        if (headings.length === 0) {
            list.innerHTML = '<li style="color:#9ca3af; font-style:italic;">No headings found</li>';
            return;
        }

        headings.forEach((heading, index) => {
            // Ensure ID
            let id = heading.id;
            if (!id) {
                id = `heading-${index}-${Math.random().toString(36).substr(2, 5)}`;
                heading.id = id;
            }

            const level = parseInt(heading.tagName.substring(1));
            const li = document.createElement('li');
            li.className = `fe-toc-item fe-toc-indent-${level}`;

            const link = document.createElement('a');
            link.className = 'fe-toc-link';
            link.textContent = heading.textContent || '(Empty Heading)';
            link.dataset.target = id;

            li.appendChild(link);
            list.appendChild(li);
        });
    }
}
