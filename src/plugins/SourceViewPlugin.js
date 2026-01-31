import { Icons } from '../ui/Icons';

export class SourceViewPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'SourceView';
        this.isSourceMode = false;
        this.textarea = null;
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('viewSource', {
            title: 'View Source',
            icon: '<b>&lt;/&gt;</b>', // Distinct from Code Block
            command: 'viewSource',
            onAction: (editor) => this.toggleSource(editor),
            checkActive: () => this.isSourceMode
        });
    }

    toggleSource(editor) {
        this.isSourceMode = !this.isSourceMode;

        if (this.isSourceMode) {
            const html = editor.getData();
            editor.contentArea.style.display = 'none';

            this.textarea = document.createElement('textarea');
            this.textarea.className = 'editor-source-view';
            this.textarea.value = html;
            this.textarea.style.cssText = 'width: 100%; height: 300px; font-family: monospace; padding: 10px; border: 1px solid #ddd; resize: vertical; outline: none; box-sizing: border-box;';

            editor.element.appendChild(this.textarea);

            // Disable other toolbar buttons? 
            // Ideally yes, but for now we just let them fail or check isSourceMode
        } else {
            if (this.textarea) {
                editor.setData(this.textarea.value);
                this.textarea.remove();
                this.textarea = null;
            }
            editor.contentArea.style.display = 'block';
        }
    }
}
