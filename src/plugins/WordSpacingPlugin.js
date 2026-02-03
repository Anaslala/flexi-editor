/**
 * WordSpacingPlugin
 * 
 * Allows users to adjust word spacing (space between words) using a range slider.
 * Similar to letter-spacing but for word-spacing CSS property.
 */

export class WordSpacingPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'WordSpacing';
    }

    init() {
        if (!this.editor.toolbar) return;

        // Register word spacing range slider
        this.editor.toolbar.registerButton('wordSpacing', {
            title: 'Word Spacing',
            label: '↔',
            type: 'range',
            min: -10,
            max: 50,
            step: 1,
            value: 0,
            onAction: (editor, value) => {
                this.applyWordSpacing(value);
            }
        });
    }

    applyWordSpacing(value) {
        // Convert value to pixels
        const spacing = value + 'px';

        // Save selection before applying
        this.editor.selection.saveSelection();

        // Get current selection
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        if (range.collapsed) {
            // No selection - apply to current block
            const block = this.getCurrentBlock();
            if (block) {
                block.style.wordSpacing = spacing;
            }
        } else {
            // Apply to selected text
            // First, save the selected content
            const selectedContent = range.cloneContents();
            
            // Create wrapper span
            const span = document.createElement('span');
            span.style.wordSpacing = spacing;
            span.style.display = 'inline';
            
            // Delete current selection
            range.deleteContents();
            
            // Add content to span
            span.appendChild(selectedContent);
            
            // Insert the span
            range.insertNode(span);
            
            // Restore selection to show the change
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }

        // Trigger change event
        this.editor.trigger('change');
        
        // Focus back to editor
        this.editor.contentArea.focus();
    }

    getCurrentBlock() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;

        let node = selection.getRangeAt(0).startContainer;

        // Traverse up to find block element
        while (node && node !== this.editor.contentArea) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const display = window.getComputedStyle(node).display;
                if (display === 'block' || node.tagName.match(/^(P|DIV|H[1-6]|BLOCKQUOTE|PRE|LI)$/)) {
                    return node;
                }
            }
            node = node.parentNode;
        }

        return null;
    }
}
