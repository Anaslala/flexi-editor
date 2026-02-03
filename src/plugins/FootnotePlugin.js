/**
 * FootnotePlugin
 * 
 * Manages footnotes:
 * - Inline references (Superscript [1])
 * - Bottom container list
 * - Auto-numbering
 * - Bi-directional linking
 */

export class FootnotePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Footnote';
    }

    init() {
        // Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            .fe-fn-ref {
                color: #2563eb;
                cursor: pointer;
                font-weight: bold;
                text-decoration: none;
                margin: 0 2px;
                user-select: none;
                font-size: 0.75em;
                vertical-align: super;
            }
            .fe-fn-ref::before { content: '['; color: #9ca3af; }
            .fe-fn-ref::after { content: ']'; color: #9ca3af; }
            
            .fe-fn-container {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                background: #f9fafb;
            }
            .fe-fn-title {
                font-size: 0.85em;
                font-weight: 600;
                color: #6b7280;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .fe-fn-list {
                list-style: none;
                padding: 0;
                margin: 0;
                counter-reset: fn-counter;
            }
            .fe-fn-item {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
                font-size: 0.9em;
                color: #4b5563;
            }
            .fe-fn-item::before {
                counter-increment: fn-counter;
                content: counter(fn-counter) ".";
                color: #9ca3af;
                font-weight: 500;
                min-width: 20px;
            }
            .fe-fn-back {
                cursor: pointer;
                color: #2563eb;
                text-decoration: none;
                opacity: 0;
                transition: opacity 0.2s;
            }
            .fe-fn-item:hover .fe-fn-back {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        // Event: Click handling for jumps
        this.editor.contentArea.addEventListener('click', (e) => {
            // Jump to Note
            if (e.target.classList.contains('fe-fn-ref')) {
                const id = e.target.dataset.id;
                const note = this.editor.contentArea.querySelector(`#fn-note-${id}`);
                if (note) note.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            // Jump Back
            if (e.target.classList.contains('fe-fn-back')) {
                const id = e.target.dataset.id;
                const ref = this.editor.contentArea.querySelector(`#fn-ref-${id}`);
                if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    insertFootnote() {
        // Ensure Container exists
        let container = this.editor.contentArea.querySelector('.fe-fn-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'fe-fn-container';
            container.contentEditable = 'false';
            container.innerHTML = `
                <div class="fe-fn-title">Footnotes</div>
                <ol class="fe-fn-list"></ol>
            `;
            this.editor.contentArea.appendChild(container);
        }

        const list = container.querySelector('.fe-fn-list');
        const id = Math.random().toString(36).substr(2, 6);

        // 1. Insert Reference at Cursor
        const ref = document.createElement('sup');
        ref.className = 'fe-fn-ref';
        ref.contentEditable = 'false';
        ref.dataset.id = id;
        ref.id = `fn-ref-${id}`;
        ref.textContent = list.children.length + 1; // Temporary number

        this.editor.execCommand('insertHTML', ref.outerHTML);

        // 2. Insert Note in List
        const note = document.createElement('li');
        note.className = 'fe-fn-item';
        note.id = `fn-note-${id}`;
        note.innerHTML = `
            <div contenteditable="true" style="flex:1; outline:none;">Type note here...</div>
            <span class="fe-fn-back" data-id="${id}">↩</span>
        `;

        list.appendChild(note);

        // 3. Move focus to the new note
        setTimeout(() => {
            const input = note.querySelector('[contenteditable="true"]');
            if (input) input.focus();
            this.updateNumbers();
        }, 50);
    }

    updateNumbers() {
        // Re-index all references in document order
        const refs = this.editor.contentArea.querySelectorAll('.fe-fn-ref');
        refs.forEach((ref, index) => {
            ref.textContent = index + 1;
        });
        // Note: The CSS list-item handling takes care of the bottom list numbers automatically
    }
}
