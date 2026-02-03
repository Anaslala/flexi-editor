/**
 * DividerPlugin
 * 
 * Inserts horizontal dividers with different styles.
 * 
 * Features:
 * - Solid, Dashed, Dotted styles
 * - Block wrapper for drag & drop support
 * 
 * Commands:
 * - divider (solid)
 * - divider-dashed
 * - divider-dotted
 */

export class DividerPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Divider';
    }

    init() {
        // No specific events to bind, just commands
    }

    /**
     * Insert a wrapped divider
     * @param {string} style - 'solid' | 'dashed' | 'dotted'
     */
    insertDivider(style = 'solid') {
        const wrapper = document.createElement('div');
        wrapper.className = 'fe-divider-block';
        wrapper.contentEditable = 'false'; // Prevent editing inside the block

        const hr = document.createElement('hr');
        hr.className = `fe-divider-${style}`;

        // Inline styles for immediate feedback
        const styles = {
            solid: 'border: 0; border-top: 2px solid #e5e7eb; margin: 0;',
            dashed: 'border: 0; border-top: 2px dashed #e5e7eb; margin: 0;',
            dotted: 'border: 0; border-top: 2px dotted #e5e7eb; margin: 0;'
        };
        hr.style.cssText = styles[style] || styles.solid;

        wrapper.appendChild(hr);

        // Styling wrapper
        wrapper.style.cssText = 'padding: 24px 0; user-select: none;';

        this.editor.execCommand('insertHTML', wrapper.outerHTML + '<p><br></p>');
    }
}
