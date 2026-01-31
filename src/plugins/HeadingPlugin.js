export class HeadingPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Heading';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('h1', {
            title: 'Heading 1',
            icon: '<b>H1</b>',
            command: 'formatBlock',
            onAction: (editor) => {
                editor.execCommand('formatBlock', 'H1');
            },
            checkActive: () => {
                const node = document.getSelection().anchorNode;
                if (!node) return false;
                const parent = node.nodeType === 3 ? node.parentNode : node;
                return parent.nodeName === 'H1';
            }
        });

        this.editor.toolbar.registerButton('h2', {
            title: 'Heading 2',
            icon: '<b>H2</b>',
            command: 'formatBlock',
            onAction: (editor) => {
                editor.execCommand('formatBlock', 'H2');
            },
            checkActive: () => {
                const node = document.getSelection().anchorNode;
                if (!node) return false;
                const parent = node.nodeType === 3 ? node.parentNode : node;
                return parent.nodeName === 'H2';
            }
        });
    }
}
