/**
 * KeyboardShortcutsPlugin
 * 
 * Provides comprehensive keyboard shortcuts and a shortcut overlay.
 * Press Ctrl+/ to see all available shortcuts.
 * 
 * Features:
 * - Enhanced keyboard shortcuts
 * - Shortcut cheat sheet overlay
 * - Tooltip hints on toolbar buttons
 * - Customizable shortcuts
 * 
 * Configuration:
 * {
 *   keyboardShortcuts: {
 *     enabled: true,
 *     overlay: true,
 *     custom: {}
 *   }
 * }
 */

export class KeyboardShortcutsPlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'KeyboardShortcuts';

        // Merge configuration
        this.options = {
            enabled: true,
            overlay: true,
            custom: {},
            ...editor.config.keyboardShortcuts,
            ...options
        };

        this.shortcuts = this.getDefaultShortcuts();
        this.overlayElement = null;
        this.keydownHandler = null;
    }

    /**
     * Initialize the plugin
     */
    init() {
        if (!this.options.enabled) {
            return;
        }

        // Register shortcuts
        this.registerShortcuts();

        // Create overlay if enabled
        if (this.options.overlay) {
            this.createOverlay();
        }

        // Add tooltips to toolbar buttons
        this.addTooltips();
    }

    /**
     * Get default shortcuts
     */
    getDefaultShortcuts() {
        return {
            // Formatting
            'Ctrl+B': { name: 'Bold', action: () => this.editor.execCommand('bold'), category: 'Formatting' },
            'Ctrl+I': { name: 'Italic', action: () => this.editor.execCommand('italic'), category: 'Formatting' },
            'Ctrl+U': { name: 'Underline', action: () => this.editor.execCommand('underline'), category: 'Formatting' },
            'Ctrl+Shift+X': { name: 'Strikethrough', action: () => this.editor.execCommand('strikethrough'), category: 'Formatting' },

            // Headings
            'Ctrl+Alt+1': { name: 'Heading 1', action: () => this.editor.execCommand('formatBlock', '<h1>'), category: 'Headings' },
            'Ctrl+Alt+2': { name: 'Heading 2', action: () => this.editor.execCommand('formatBlock', '<h2>'), category: 'Headings' },
            'Ctrl+Alt+3': { name: 'Heading 3', action: () => this.editor.execCommand('formatBlock', '<h3>'), category: 'Headings' },
            'Ctrl+Alt+4': { name: 'Heading 4', action: () => this.editor.execCommand('formatBlock', '<h4>'), category: 'Headings' },
            'Ctrl+Alt+5': { name: 'Heading 5', action: () => this.editor.execCommand('formatBlock', '<h5>'), category: 'Headings' },
            'Ctrl+Alt+6': { name: 'Heading 6', action: () => this.editor.execCommand('formatBlock', '<h6>'), category: 'Headings' },
            'Ctrl+Alt+0': { name: 'Paragraph', action: () => this.editor.execCommand('formatBlock', '<p>'), category: 'Headings' },

            // Lists
            'Ctrl+Shift+8': { name: 'Bullet List', action: () => this.editor.execCommand('insertUnorderedList'), category: 'Lists' },
            'Ctrl+Shift+7': { name: 'Numbered List', action: () => this.editor.execCommand('insertOrderedList'), category: 'Lists' },

            // Blocks
            'Ctrl+K': { name: 'Insert Link', action: () => this.insertLink(), category: 'Blocks' },
            'Ctrl+Shift+I': { name: 'Insert Image', action: () => this.triggerImageDialog(), category: 'Blocks' },
            'Ctrl+Shift+C': { name: 'Code Block', action: () => this.editor.execCommand('formatBlock', '<pre>'), category: 'Blocks' },

            // Editing
            'Ctrl+Z': { name: 'Undo', action: () => this.editor.execCommand('undo'), category: 'Editing' },
            'Ctrl+Y': { name: 'Redo', action: () => this.editor.execCommand('redo'), category: 'Editing' },
            'Ctrl+Shift+Z': { name: 'Redo', action: () => this.editor.execCommand('redo'), category: 'Editing' },
            'Ctrl+A': { name: 'Select All', action: () => this.editor.execCommand('selectAll'), category: 'Editing' },
            // Removed Cut/Copy/Paste to let browser handle them natively
            // 'Ctrl+X': { name: 'Cut', action: () => document.execCommand('cut'), category: 'Editing' },
            // 'Ctrl+C': { name: 'Copy', action: () => document.execCommand('copy'), category: 'Editing' },
            // 'Ctrl+V': { name: 'Paste', action: () => document.execCommand('paste'), category: 'Editing' },

            // Navigation
            'Ctrl+Home': { name: 'Go to Top', action: () => this.goToTop(), category: 'Navigation' },
            'Ctrl+End': { name: 'Go to Bottom', action: () => this.goToBottom(), category: 'Navigation' },

            // View
            'Ctrl+/': { name: 'Show Shortcuts', action: () => this.toggleOverlay(), category: 'View' }
        };
    }

    /**
     * Register shortcuts
     */
    registerShortcuts() {
        this.keydownHandler = (e) => {
            const key = this.getKeyCombo(e);
            const shortcut = this.shortcuts[key] || this.options.custom[key];

            if (shortcut) {
                e.preventDefault();
                shortcut.action();
            }
        };

        this.editor.contentArea.addEventListener('keydown', this.keydownHandler);
    }

    /**
     * Get key combination string
     */
    getKeyCombo(e) {
        const parts = [];

        if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');

        // Get key name
        let key = e.key;
        if (key === ' ') key = 'Space';
        else if (key.length === 1) key = key.toUpperCase();

        parts.push(key);

        return parts.join('+');
    }

    /**
     * Create shortcut overlay
     */
    createOverlay() {
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'keyboard-shortcuts-overlay';
        this.overlayElement.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #1f2937;
            border-radius: 16px;
            width: 800px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            padding: 32px;
            color: white;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;';
        header.innerHTML = `
            <h2 style="margin: 0; font-size: 28px; font-weight: 700;">⌨️ Keyboard Shortcuts</h2>
            <button class="close-overlay" style="
                background: transparent;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background 0.15s ease;
            ">×</button>
        `;

        panel.appendChild(header);

        // Group shortcuts by category
        const categories = {};
        Object.entries(this.shortcuts).forEach(([key, shortcut]) => {
            if (!categories[shortcut.category]) {
                categories[shortcut.category] = [];
            }
            categories[shortcut.category].push({ key, ...shortcut });
        });

        // Render categories
        Object.entries(categories).forEach(([category, shortcuts]) => {
            const section = document.createElement('div');
            section.style.cssText = 'margin-bottom: 24px;';

            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = category;
            categoryTitle.style.cssText = 'margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #9ca3af;';
            section.appendChild(categoryTitle);

            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 8px;';

            shortcuts.forEach(shortcut => {
                const item = document.createElement('div');
                item.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                `;

                item.innerHTML = `
                    <span style="font-size: 14px;">${shortcut.name}</span>
                    <kbd style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-family: monospace;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    ">${shortcut.key}</kbd>
                `;

                grid.appendChild(item);
            });

            section.appendChild(grid);
            panel.appendChild(section);
        });

        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = 'margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; color: #9ca3af; font-size: 14px;';
        footer.textContent = 'Press Ctrl+/ or Escape to close';
        panel.appendChild(footer);

        this.overlayElement.appendChild(panel);
        document.body.appendChild(this.overlayElement);

        // Close button
        header.querySelector('.close-overlay').addEventListener('click', () => {
            this.hideOverlay();
        });

        // Close on overlay click
        this.overlayElement.addEventListener('click', (e) => {
            if (e.target === this.overlayElement) {
                this.hideOverlay();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlayElement.style.display === 'flex') {
                this.hideOverlay();
            }
        });
    }

    /**
     * Toggle overlay
     */
    toggleOverlay() {
        if (!this.overlayElement) return;

        if (this.overlayElement.style.display === 'flex') {
            this.hideOverlay();
        } else {
            this.showOverlay();
        }
    }

    /**
     * Show overlay
     */
    showOverlay() {
        if (!this.overlayElement) return;

        this.overlayElement.style.display = 'flex';

        requestAnimationFrame(() => {
            this.overlayElement.style.opacity = '1';
            this.overlayElement.querySelector('div').style.transform = 'scale(1)';
        });
    }

    /**
     * Hide overlay
     */
    hideOverlay() {
        if (!this.overlayElement) return;

        this.overlayElement.style.opacity = '0';
        this.overlayElement.querySelector('div').style.transform = 'scale(0.9)';

        setTimeout(() => {
            this.overlayElement.style.display = 'none';
        }, 300);
    }

    /**
     * Add tooltips to toolbar buttons
     */
    addTooltips() {
        // This would integrate with existing toolbar buttons
        // For now, just log that tooltips would be added
        // TODO: Implement tooltips integration with Toolbar
        // console.log('KeyboardShortcuts: Tooltips would be added to toolbar buttons');
    }

    /**
     * Helper: Insert link
     */
    insertLink() {
        const url = prompt('Enter URL:');
        if (url) {
            this.editor.execCommand('createLink', url);
        }
    }

    /**
     * Helper: Trigger image dialog
     */
    triggerImageDialog() {
        const imagePlugin = this.editor.plugins.get('Image');
        if (imagePlugin) {
            const imageButton = this.editor.toolbar?.buttons?.get?.('image');
            if (imageButton && imageButton.onAction) {
                imageButton.onAction(this.editor);
            }
        }
    }

    /**
     * Helper: Go to top
     */
    goToTop() {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(this.editor.contentArea, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        this.editor.contentArea.scrollTop = 0;
    }

    /**
     * Helper: Go to bottom
     */
    goToBottom() {
        const range = document.createRange();
        const sel = window.getSelection();
        const lastChild = this.editor.contentArea.lastChild;
        if (lastChild) {
            range.setStartAfter(lastChild);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }
        this.editor.contentArea.scrollTop = this.editor.contentArea.scrollHeight;
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.keydownHandler) {
            this.editor.contentArea.removeEventListener('keydown', this.keydownHandler);
        }

        if (this.overlayElement && this.overlayElement.parentNode) {
            this.overlayElement.remove();
        }

        this.overlayElement = null;
        this.keydownHandler = null;
    }
}
