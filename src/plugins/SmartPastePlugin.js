/**
 * SmartPastePlugin
 * 
 * Intelligently cleans pasted content from Word/Google Docs while preserving semantic formatting.
 * 
 * Features:
 * - Removes inline styles and Word-specific markup
 * - Preserves headings, lists, bold, italic, links
 * - Configurable cleaning rules
 * - Fallback to plain text on error
 * 
 * Configuration:
 * {
 *   smartPaste: {
 *     enabled: true,           // Enable/disable smart paste
 *     mode: 'clean',           // 'clean' | 'plain' | 'preserve'
 *     preserveTags: [...],     // Tags to preserve
 *     removeAttributes: [...]  // Attributes to remove
 *   }
 * }
 */

export class SmartPastePlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'SmartPaste';

        // Merge configuration
        this.options = {
            enabled: true,
            mode: 'clean', // 'clean' | 'plain' | 'preserve'
            preserveTags: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br',
                'ul', 'ol', 'li',
                'strong', 'b', 'em', 'i',
                'a', 'code', 'pre',
                'blockquote'
            ],
            removeAttributes: [
                'style', 'class', 'id', 'lang', 'dir', 'align'
            ],
            ...editor.config.smartPaste,
            ...options
        };

        this.pasteHandler = null;
    }

    /**
     * Initialize the plugin
     */
    init() {
        if (!this.options.enabled) {
            return;
        }

        // Add paste event listener
        this.pasteHandler = (e) => {
            this.handlePaste(e);
        };

        // Add listener with capture to intercept before editor's handler
        // Add listener with capture to intercept before editor's handler
        // FIXME: Temporarily disabled to fix copy paste issues
        // this.editor.contentArea.addEventListener('paste', this.pasteHandler, true);
    }

    /**
     * Handle paste event
     */
    handlePaste(e) {
        try {
            const clipboardData = e.clipboardData || window.clipboardData;

            if (!clipboardData) {
                return; // Let default handler work
            }

            const html = clipboardData.getData('text/html');
            const text = clipboardData.getData('text/plain');

            // Mode: plain - always use plain text
            if (this.options.mode === 'plain') {
                e.preventDefault();
                this.insertPlainText(text);
                return;
            }

            // Mode: preserve - don't clean, let default handler work
            if (this.options.mode === 'preserve') {
                return;
            }

            // Mode: clean - clean HTML if present
            if (html && this.detectRichHTML(html)) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Prevent other handlers
                const cleaned = this.cleanHTML(html);
                this.insertHTML(cleaned);
            }

            // If neither matches, we do nothing and let the event bubble 
            // to the default editor handler (Flexi-editor.js handlePaste)
            // which handles standard HTML/Text pasting.

        } catch (error) {
            console.error('SmartPaste: Error handling paste:', error);
            // Let default paste handler work on error
        }
    }

    /**
     * Detect if HTML needs cleaning (has rich formatting)
     */
    detectRichHTML(html) {
        // Check for Word markup
        if (html.includes('mso-') || html.includes('<o:p>') || html.includes('<w:')) {
            return true;
        }

        // Check for inline styles
        if (html.includes('style=')) {
            return true;
        }

        // Check for excessive spans/divs
        const spanCount = (html.match(/<span/gi) || []).length;
        const divCount = (html.match(/<div/gi) || []).length;
        if (spanCount > 3 || divCount > 3) {
            return true;
        }

        return false;
    }

    /**
     * Clean HTML content
     */
    cleanHTML(html) {
        try {
            // Step 1: Remove Word-specific markup
            html = this.removeWordMarkup(html);

            // Step 2: Parse HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;

            // Step 3: Remove inline styles and unwanted attributes
            this.removeInlineStyles(temp);

            // Step 4: Remove unnecessary tags
            this.removeUnnecessaryTags(temp);

            // Step 5: Preserve only semantic tags
            this.preserveSemanticTags(temp);

            // Step 6: Clean up whitespace
            let cleaned = temp.innerHTML;
            cleaned = this.normalizeWhitespace(cleaned);

            return cleaned;

        } catch (error) {
            console.error('SmartPaste: Error cleaning HTML:', error);
            // Fallback to plain text
            return this.fallbackToPlainText(html);
        }
    }

    /**
     * Remove Word-specific markup
     */
    removeWordMarkup(html) {
        // Remove Word-specific tags
        html = html.replace(/<\/?o:p>/gi, '');
        html = html.replace(/<\/?w:[^>]*>/gi, '');
        html = html.replace(/<\/?m:[^>]*>/gi, '');
        html = html.replace(/<\/?v:[^>]*>/gi, '');

        // Remove mso-* attributes
        html = html.replace(/\s*mso-[^:]+:[^;"]+;?/gi, '');

        // Remove Word comments
        html = html.replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '');
        html = html.replace(/<!--[\s\S]*?-->/g, '');

        // Remove font tags
        html = html.replace(/<\/?font[^>]*>/gi, '');

        // Remove XML namespaces
        html = html.replace(/<\?xml[^>]*>/gi, '');

        return html;
    }

    /**
     * Remove inline styles and unwanted attributes
     */
    removeInlineStyles(element) {
        const allElements = element.querySelectorAll('*');

        allElements.forEach(el => {
            // Remove unwanted attributes
            this.options.removeAttributes.forEach(attr => {
                el.removeAttribute(attr);
            });

            // Keep href on links
            if (el.tagName.toLowerCase() === 'a' && el.hasAttribute('href')) {
                const href = el.getAttribute('href');
                Array.from(el.attributes).forEach(attr => {
                    if (attr.name !== 'href') {
                        el.removeAttribute(attr.name);
                    }
                });
                el.setAttribute('href', href);
            }
        });
    }

    /**
     * Remove unnecessary tags (spans, divs) while keeping content
     */
    removeUnnecessaryTags(element) {
        const unnecessaryTags = ['span', 'div', 'font'];

        unnecessaryTags.forEach(tagName => {
            const elements = element.querySelectorAll(tagName);
            elements.forEach(el => {
                // Replace element with its content
                const parent = el.parentNode;
                while (el.firstChild) {
                    parent.insertBefore(el.firstChild, el);
                }
                parent.removeChild(el);
            });
        });
    }

    /**
     * Preserve only semantic tags
     */
    preserveSemanticTags(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_ELEMENT,
            null,
            false
        );

        const nodesToRemove = [];

        while (walker.nextNode()) {
            const node = walker.currentNode;
            const tagName = node.tagName.toLowerCase();

            if (!this.options.preserveTags.includes(tagName)) {
                nodesToRemove.push(node);
            }
        }

        // Replace disallowed tags with their content
        nodesToRemove.forEach(node => {
            const parent = node.parentNode;
            if (parent) {
                while (node.firstChild) {
                    parent.insertBefore(node.firstChild, node);
                }
                parent.removeChild(node);
            }
        });
    }

    /**
     * Normalize whitespace
     */
    normalizeWhitespace(html) {
        // Remove excessive line breaks
        html = html.replace(/(\r\n|\n|\r){3,}/g, '\n\n');

        // Remove excessive spaces
        html = html.replace(/ {2,}/g, ' ');

        // Trim
        html = html.trim();

        return html;
    }

    /**
     * Fallback to plain text extraction
     */
    fallbackToPlainText(html) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    }

    /**
     * Insert cleaned HTML
     */
    insertHTML(html) {
        this.editor.selection.restoreSelection();
        this.editor.execCommand('insertHTML', html);
    }

    /**
     * Insert plain text
     */
    insertPlainText(text) {
        this.editor.selection.restoreSelection();
        this.editor.execCommand('insertText', text);
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.pasteHandler) {
            this.editor.contentArea.removeEventListener('paste', this.pasteHandler, true);
            this.pasteHandler = null;
        }
    }
}
