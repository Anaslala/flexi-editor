import { Icons } from '../ui/Icons';

export class LineHeightPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'LineHeight';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('lineHeight', {
            type: 'range',
            title: 'Line Height',
            label: '↕',
            min: '1.0',
            max: '3.0',
            step: '0.1',
            value: '1.5',
            onAction: (editor, value) => {
                this.applyLineHeight(value);
            }
        });
    }

    applyLineHeight(value) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const anchor = selection.anchorNode;
        const element = anchor.nodeType === 3 ? anchor.parentNode : anchor;
        const block = element.closest('p, h1, h2, h3, h4, h5, h6, div, li, blockquote');

        if (block) {
            block.style.lineHeight = value;
            this.editor.trigger('change');
        } else {
            this.editor.execCommand('formatBlock', 'P');
            setTimeout(() => this.applyLineHeight(value), 0);
        }
    }
}
