import { Icons } from '../ui/Icons';

export class BlockUtilsPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'BlockUtils';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('blockquote', {
            title: 'Blockquote',
            icon: Icons.quote,
            command: 'formatBlock',
            onAction: (editor) => {
                editor.execCommand('formatBlock', 'BLOCKQUOTE');
            },
            checkActive: (editor) => {
                const node = document.getSelection().anchorNode;
                if (!node) return false;
                const parent = node.nodeType === 3 ? node.parentNode : node;
                return parent.closest('blockquote');
            }
        });

        this.editor.toolbar.registerButton('insertHorizontalRule', {
            title: 'Horizontal Line',
            icon: Icons.hr,
            command: 'insertHorizontalRule'
        });
    }
}
