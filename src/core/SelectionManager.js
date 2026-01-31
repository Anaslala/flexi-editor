export class SelectionManager {
    constructor(editor) {
        this.editor = editor;
        this.savedRange = null;
    }

    /**
     * Returns the current Selection object.
     */
    getSelection() {
        return window.getSelection();
    }

    /**
     * Returns the current range, or null if outside editor.
     */
    getRange() {
        const selection = this.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            // Check if range is within editor
            if (this.editor.contentArea.contains(range.commonAncestorContainer)) {
                return range;
            }
        }
        return null;
    }

    /**
     * Saves the current selection range.
     */
    saveSelection() {
        const range = this.getRange();
        if (range) {
            this.savedRange = range.cloneRange();
        }
    }

    /**
     * Restores the saved selection range.
     */
    restoreSelection() {
        if (this.savedRange) {
            const selection = this.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.savedRange);
        }
    }

    /**
     * Clears the saved selection.
     */
    clearSaved() {
        this.savedRange = null;
    }

    /**
     * Checks if the selection is collapsed (cursor only).
     */
    isCollapsed() {
        const range = this.getRange();
        return range ? range.collapsed : true;
    }
}
