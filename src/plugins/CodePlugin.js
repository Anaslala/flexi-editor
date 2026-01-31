import { Icons } from '../ui/Icons';

export class CodePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Code';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('codeBlock', {
            title: 'Code Block',
            icon: Icons.code,
            command: 'formatBlock',
            onAction: (editor) => {
                const node = this.editor.selection.getSelection().anchorNode;
                if (!node) return;

                const element = node.nodeType === 3 ? node.parentNode : node;
                const pre = element.closest('pre');

                if (pre) {
                    // Turn off code block (unwrap)
                    // This is tricky in vanilla, simplified: format to Paragraph
                    editor.execCommand('formatBlock', 'P');
                } else {
                    // Turn on code block
                    editor.execCommand('formatBlock', 'PRE');
                    // Optional: Wrap content in <code> if not already? 
                    // execCommand 'formatBlock' PRE usually just makes the container <pre>
                }
            },
            checkActive: (editor) => {
                const node = this.editor.selection.getSelection().anchorNode;
                if (!node) return false;
                const element = node.nodeType === 3 ? node.parentNode : node;
                return !!element.closest('pre');
            }
        });
    }
}
