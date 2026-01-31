export class WordCountPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'WordCount';
        this.statusBar = null;
    }

    init() {
        // Create Status Bar if not exists
        if (!this.editor.statusBar) {
            this.createStatusBar();
        }

        // Add stats element
        this.stats = document.createElement('span');
        this.stats.className = 'editor-stats';
        this.stats.style.cssText = 'font-size: 12px; color: #666; font-family: sans-serif;';
        this.editor.statusBar.appendChild(this.stats);

        // Bind events
        this.editor.on('change', () => this.update());
        this.editor.on('keyup', () => this.update());

        this.update();
    }

    createStatusBar() {
        this.editor.statusBar = document.createElement('div');
        this.editor.statusBar.className = 'editor-status-bar';
        this.editor.statusBar.style.cssText = 'padding: 5px 10px; border-top: 1px solid #ddd; background: #f9f9f9; display: flex; justify-content: flex-end;';
        this.editor.element.appendChild(this.editor.statusBar);
    }

    update() {
        const text = this.editor.contentArea.innerText || '';
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        this.stats.textContent = `${words} words, ${chars} characters`;
    }
}
