export class HeadingPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Heading';
    }

    init() {
        if (!this.editor.toolbar) return;

        // Create dropdown for headings using select type
        this.editor.toolbar.registerButton('heading', {
            type: 'select',
            title: 'Heading',
            options: [
                { value: 'P', text: 'Paragraph' },
                { value: 'H1', text: 'Heading 1' },
                { value: 'H2', text: 'Heading 2' },
                { value: 'H3', text: 'Heading 3' },
                { value: 'H4', text: 'Heading 4' },
                { value: 'H5', text: 'Heading 5' },
                { value: 'H6', text: 'Heading 6' }
            ],
            onAction: (editor, value) => {
                editor.execCommand('formatBlock', value);
            },
            checkActive: (editor) => {
                const node = document.getSelection().anchorNode;
                if (!node) return 'P';
                const parent = node.nodeType === 3 ? node.parentNode : node;
                const tagName = parent.nodeName;
                return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tagName) ? tagName : 'P';
            }
        });
    }
}
