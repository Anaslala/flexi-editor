export class TextTransformPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'TextTransform';
    }

    init() {
        if (!this.editor.toolbar) return;

        // We can add a dropdown or individual buttons.
        // Let's add a "Case" dropdown
        this.editor.toolbar.registerButton('textTransform', {
            type: 'select',
            width: '90px',
            title: 'Change Case',
            options: [
                { value: 'none', text: 'Case' },
                { value: 'uppercase', text: 'UPPERCASE' },
                { value: 'lowercase', text: 'lowercase' },
                { value: 'capitalize', text: 'Capitalize' },
            ],
            onAction: (editor, value) => {
                if (value === 'none') return;
                this.transformText(value);
            }
        });
    }

    transformText(mode) {
        const selection = window.getSelection();
        if (selection.isCollapsed) return;

        const text = selection.toString();
        let newText = text;

        if (mode === 'uppercase') newText = text.toUpperCase();
        if (mode === 'lowercase') newText = text.toLowerCase();
        if (mode === 'capitalize') {
            newText = text.replace(/\b\w/g, c => c.toUpperCase());
        }

        this.editor.execCommand('insertText', newText);
    }
}
