import { Icons } from '../ui/Icons';

export class DirectionPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Direction';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('dirLTR', {
            title: 'Left-to-Right',
            icon: Icons.alignLeft || 'LTR', // Fallback if icon missing
            command: 'justifyLeft', // Usually aligns left too
            onAction: (editor) => this.setDirection('ltr')
        });

        this.editor.toolbar.registerButton('dirRTL', {
            title: 'Right-to-Left',
            icon: Icons.alignRight || 'RTL', // Fallback
            command: 'justifyRight',
            onAction: (editor) => this.setDirection('rtl')
        });
    }

    setDirection(dir) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const anchor = selection.anchorNode;
        const element = anchor.nodeType === 3 ? anchor.parentNode : anchor;
        const block = element.closest('p, h1, h2, h3, h4, h5, h6, div, li, blockquote');

        if (block) {
            block.style.direction = dir;
            block.style.textAlign = dir === 'rtl' ? 'right' : 'left';
            this.editor.trigger('change');
        } else {
            this.editor.execCommand('formatBlock', 'P');
            setTimeout(() => this.setDirection(dir), 0);
        }
    }
}
