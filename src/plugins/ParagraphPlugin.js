export class ParagraphPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Paragraph';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('paragraph', {
            title: 'Paragraph',
            icon: '<b>P</b>',
            command: 'formatBlock',
            onAction: (editor) => {
                editor.execCommand('formatBlock', 'P');
            },
            checkActive: () => {
                const node = document.getSelection().anchorNode;
                if (!node) return false;
                const parent = node.nodeType === 3 ? node.parentNode : node;
                return parent.nodeName === 'P';
            }
        });
    }
}
