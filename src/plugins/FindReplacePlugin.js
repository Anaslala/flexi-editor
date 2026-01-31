import { Icons } from '../ui/Icons';

export class FindReplacePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'FindReplace';
        this.isOpen = false;
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
    }

    createDialog() {
        this.dialog = document.createElement('div');
        this.dialog.className = 'editor-find-replace';
        this.dialog.style.display = 'none';

        // Inline styles for simplicity in this artifact
        this.dialog.innerHTML = `
            <div style="display:flex; gap:5px; margin-bottom:5px;">
                <input type="text" id="editor-find-input" placeholder="Find..." style="flex:1; padding:4px;">
                <button id="editor-find-next-btn">Next</button>
            </div>
            <div style="display:flex; gap:5px;">
                <input type="text" id="editor-replace-input" placeholder="Replace with..." style="flex:1; padding:4px;">
                <button id="editor-replace-btn">Replace</button>
                <button id="editor-replace-all-btn">All</button>
            </div>
        `;

        // Append contextually. If toolbar is external, this might need better placement.
        // For now, absolute position near toolbar or inside editor container.
        this.editor.element.appendChild(this.dialog);

        this.bindEvents();
    }

    bindEvents() {
        const findInput = this.dialog.querySelector('#editor-find-input');
        const replaceInput = this.dialog.querySelector('#editor-replace-input');
        const nextBtn = this.dialog.querySelector('#editor-find-next-btn');
        const replaceBtn = this.dialog.querySelector('#editor-replace-btn');
        const replaceAllBtn = this.dialog.querySelector('#editor-replace-all-btn');

        nextBtn.onclick = () => {
            const query = findInput.value;
            if (query) window.find(query);
        };

        replaceBtn.onclick = () => {
            const query = findInput.value;
            const replacement = replaceInput.value;
            if (query) {
                // Basic native execCommand approach to ensure history stack
                // Note: window.find selects the text. insertText replaces selection.
                // This is a rough implementation.
                if (window.getSelection().toString() === query) {
                    this.editor.execCommand('insertText', replacement);
                } else {
                    if (window.find(query)) {
                        this.editor.execCommand('insertText', replacement);
                    }
                }
            }
        };

        replaceAllBtn.onclick = () => {
            const query = findInput.value;
            const replacement = replaceInput.value;
            if (!query) return;

            const body = this.editor.contentArea;
            const content = body.innerHTML;
            // Simple regex replace ALL (careful with HTML tags!)
            // To be safe, we should traverse text nodes. 
            // For now, this is a basic "HTML content replace" which is risky but requested "simple".
            // A safer way is using a TreeWalker.

            // Let's do a slightly safer regex that tries to avoid tags? No, too complex for regex.
            // Let's stick to the prompt-based simple tool philosophy:
            // We'll iterate find() until false.

            // Reset cursor
            window.getSelection().removeAllRanges();
            // Move to start
            const range = document.createRange();
            range.selectNodeContents(this.editor.contentArea);
            range.collapse(true);
            window.getSelection().addRange(range);

            let count = 0;
            while (window.find(query)) {
                this.editor.execCommand('insertText', replacement);
                count++;
                if (count > 1000) break; // Safety break
            }
        };
    }

    toggleDialog() {
        this.isOpen = !this.isOpen;
        this.dialog.style.display = this.isOpen ? 'block' : 'none';
        if (this.isOpen) {
            this.dialog.querySelector('#editor-find-input').focus();
        }
    }
}
