/**
 * FloatingToolbarPlugin
 * 
 * Shows a floating mini toolbar when text is selected.
 * Provides quick access to common formatting options.
 * 
 * Features:
 * - Appears on text selection
 * - Smart positioning (above/below selection)
 * - Compact, icon-only design
 * - Smooth animations
 * 
 * Configuration:
 * {
 *   floatingToolbar: {
 *     enabled: true,
 *     buttons: ['bold', 'italic', 'underline', 'link', 'color', 'heading'],
 *     position: 'auto'
 *   }
 * }
 */

import { Icons } from '../ui/Icons';
import { ColorPicker } from '../ui/ColorPicker.js';

export class FloatingToolbarPlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'FloatingToolbar';

        // Merge configuration
        this.options = {
            enabled: true,
            buttons: ['bold', 'italic', 'underline', 'link', 'color', 'heading'],
            position: 'auto', // 'auto' | 'top' | 'bottom'
            ...editor.config.floatingToolbar,
            ...options
        };

        this.toolbar = null;
        this.isVisible = false;
        this.selectionChangeHandler = null;
        this.mouseUpHandler = null;
    }

    /**
     * Initialize the plugin
     */
    init() {
        if (!this.options.enabled) {
            return;
        }

        // Create floating toolbar
        this.createToolbar();

        // Listen to selection changes
        this.selectionChangeHandler = () => {
            setTimeout(() => this.handleSelectionChange(), 10);
        };

        this.mouseUpHandler = () => {
            setTimeout(() => this.handleSelectionChange(), 10);
        };

        document.addEventListener('selectionchange', this.selectionChangeHandler);
        this.editor.contentArea.addEventListener('mouseup', this.mouseUpHandler);

        // Hide on click outside
        document.addEventListener('mousedown', (e) => {
            if (this.toolbar && !this.toolbar.contains(e.target) && !this.editor.contentArea.contains(e.target)) {
                this.hide();
            }
        });
    }

    /**
     * Create floating toolbar element
     */
    createToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'floating-toolbar';
        this.toolbar.style.cssText = `
            position: absolute;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            padding: 4px;
            display: none;
            z-index: 9999;
            opacity: 0;
            transform: translateY(-5px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: none;
        `;

        // Add buttons
        this.options.buttons.forEach(buttonName => {
            const button = this.createButton(buttonName);
            if (button) {
                this.toolbar.appendChild(button);
            }
        });

        document.body.appendChild(this.toolbar);
    }

    /**
     * Create toolbar button
     */
    createButton(name) {
        const buttonConfig = this.getButtonConfig(name);
        if (!buttonConfig) return null;

        const button = document.createElement('button');
        button.className = 'floating-toolbar-btn';
        button.innerHTML = buttonConfig.icon;
        button.title = buttonConfig.title;
        button.style.cssText = `
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            border-radius: 4px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #374151;
            transition: all 0.15s ease;
            font-size: 16px;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#f3f4f6';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = 'transparent';
        });

        button.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent losing selection
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            buttonConfig.action(button);
        });

        return button;
    }

    /**
     * Get button configuration
     */
    getButtonConfig(name) {
        const configs = {
            bold: {
                icon: Icons.bold || '<strong>B</strong>',
                title: 'Bold (Ctrl+B)',
                action: () => this.editor.execCommand('bold')
            },
            italic: {
                icon: Icons.italic || '<em>I</em>',
                title: 'Italic (Ctrl+I)',
                action: () => this.editor.execCommand('italic')
            },
            underline: {
                icon: Icons.underline || '<u>U</u>',
                title: 'Underline (Ctrl+U)',
                action: () => this.editor.execCommand('underline')
            },
            link: {
                icon: Icons.link || '🔗',
                title: 'Insert Link (Ctrl+K)',
                action: () => {
                    // Trigger the link dialog from toolbar
                    const linkButton = this.editor.toolbar?.buttonCache?.get('link');
                    if (linkButton && linkButton.btn) {
                        // Click the link button to open dialog
                        linkButton.btn.click();
                    }
                }
            },
            color: {
                icon: '🎨',
                title: 'Text Color',
                action: (btn) => {
                    if (!this.colorPicker) {
                        this.colorPicker = new ColorPicker(this.editor, (color) => {
                            this.editor.execCommand('foreColor', color);
                        });
                    }
                    this.colorPicker.show(btn);
                }
            },
            heading: {
                icon: 'H',
                title: 'Heading',
                action: () => {
                    this.editor.execCommand('formatBlock', '<h2>');
                }
            }
        };

        return configs[name];
    }

    /**
     * Handle selection change
     */
    handleSelectionChange() {
        const selection = window.getSelection();

        // Check if selection is in editor
        if (!selection || selection.rangeCount === 0) {
            this.hide();
            return;
        }

        const range = selection.getRangeAt(0);

        // Check if selection is within editor
        if (!this.editor.contentArea.contains(range.commonAncestorContainer)) {
            this.hide();
            return;
        }

        // Check if text is selected
        const selectedText = selection.toString().trim();
        if (!selectedText) {
            this.hide();
            return;
        }

        // Show toolbar
        this.show(range);
    }

    /**
     * Show floating toolbar
     */
    show(range) {
        if (!this.toolbar) return;

        // Get selection bounding rect
        const rect = range.getBoundingClientRect();

        // Calculate position
        const toolbarRect = this.toolbar.getBoundingClientRect();
        const toolbarWidth = toolbarRect.width || 200;
        const toolbarHeight = toolbarRect.height || 40;

        let top, left;

        // Smart positioning
        if (this.options.position === 'bottom') {
            top = rect.bottom + window.scrollY + 8;
        } else if (this.options.position === 'top') {
            top = rect.top + window.scrollY - toolbarHeight - 8;
        } else {
            // Auto: show above if space available, otherwise below
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;

            if (spaceAbove > toolbarHeight + 20) {
                top = rect.top + window.scrollY - toolbarHeight - 8;
            } else {
                top = rect.bottom + window.scrollY + 8;
            }
        }

        // Center horizontally
        left = rect.left + window.scrollX + (rect.width / 2) - (toolbarWidth / 2);

        // Keep within viewport
        const maxLeft = window.innerWidth - toolbarWidth - 10;
        left = Math.max(10, Math.min(left, maxLeft));

        // Position toolbar
        this.toolbar.style.top = `${top}px`;
        this.toolbar.style.left = `${left}px`;
        this.toolbar.style.display = 'flex';
        this.toolbar.style.gap = '2px';
        this.toolbar.style.pointerEvents = 'auto';

        // Animate in
        requestAnimationFrame(() => {
            this.toolbar.style.opacity = '1';
            this.toolbar.style.transform = 'translateY(0)';
        });

        this.isVisible = true;
    }

    /**
     * Hide floating toolbar
     */
    hide() {
        if (!this.toolbar || !this.isVisible) return;

        this.toolbar.style.opacity = '0';
        this.toolbar.style.transform = 'translateY(-5px)';

        setTimeout(() => {
            if (this.toolbar) {
                this.toolbar.style.display = 'none';
                this.toolbar.style.pointerEvents = 'none';
            }
        }, 200);

        this.isVisible = false;
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.selectionChangeHandler) {
            document.removeEventListener('selectionchange', this.selectionChangeHandler);
        }

        if (this.mouseUpHandler) {
            this.editor.contentArea.removeEventListener('mouseup', this.mouseUpHandler);
        }

        if (this.toolbar && this.toolbar.parentNode) {
            this.toolbar.remove();
        }

        this.toolbar = null;
        this.selectionChangeHandler = null;
        this.mouseUpHandler = null;
    }
}
