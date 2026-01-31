export class LetterSpacingPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'LetterSpacing';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('letterSpacing', {
            type: 'range',
            title: 'Letter Spacing',
            label: '↔',
            min: '-2',
            max: '10',
            step: '0.5',
            value: '0',
            onAction: (editor, value) => {
                this.applyLetterSpacing(value + 'px');
            }
        });
    }

    applyLetterSpacing(value) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const anchor = selection.anchorNode;
        const element = anchor.nodeType === 3 ? anchor.parentNode : anchor;

        // Apply to the closest block element to ensure stability during sliding
        // (wrapping spans repeatedly essentially breaks range during 'input' events)
        const block = element.closest('p, h1, h2, h3, h4, h5, h6, div, li, blockquote');

        if (block) {
            block.style.letterSpacing = value;
            this.editor.trigger('change');
        } else {
            // Fallback for edge cases
            this.editor.execCommand('formatBlock', 'P');
            setTimeout(() => this.applyLetterSpacing(value), 0);
        }
    }
}
