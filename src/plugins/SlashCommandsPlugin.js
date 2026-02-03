/**
 * SlashCommandsPlugin
 * 
 * Provides Notion-like slash commands for quick content insertion.
 * Type "/" to see available commands.
 * 
 * Features:
 * - Slash command menu
 * - Search/filter commands
 * - Keyboard navigation
 * - Quick content insertion
 * 
 * Configuration:
 * {
 *   slashCommands: {
 *     enabled: true,
 *     trigger: '/',
 *     commands: [...]
 *   }
 * }
 */

export class SlashCommandsPlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'SlashCommands';

        // Merge configuration
        this.options = {
            enabled: true,
            trigger: '/',
            commands: this.getDefaultCommands(),
            ...editor.config.slashCommands,
            ...options
        };

        this.menu = null;
        this.isVisible = false;
        this.selectedIndex = 0;
        this.filteredCommands = [];
        this.triggerPosition = null;
        this.searchQuery = '';
        this.keydownHandler = null;
    }

    /**
     * Initialize the plugin
     */
    init() {
        if (!this.options.enabled) {
            return;
        }

        // Create menu
        this.createMenu();

        // Listen to keydown
        this.keydownHandler = (e) => this.handleKeydown(e);
        this.editor.contentArea.addEventListener('keydown', this.keydownHandler);

        // Listen to input
        this.editor.contentArea.addEventListener('input', () => {
            if (this.isVisible) {
                this.updateSearch();
            }
        });
    }

    /**
     * Get default commands
     */
    getDefaultCommands() {
        return [
            {
                name: 'Heading 1',
                description: 'Large section heading',
                icon: 'H1',
                keywords: ['h1', 'heading', 'title'],
                action: () => {
                    this.insertContent('<h1>Heading 1</h1>');
                }
            },
            {
                name: 'Heading 2',
                description: 'Medium section heading',
                icon: 'H2',
                keywords: ['h2', 'heading', 'subtitle'],
                action: () => {
                    this.insertContent('<h2>Heading 2</h2>');
                }
            },
            {
                name: 'Heading 3',
                description: 'Small section heading',
                icon: 'H3',
                keywords: ['h3', 'heading'],
                action: () => {
                    this.insertContent('<h3>Heading 3</h3>');
                }
            },
            {
                name: 'Paragraph',
                description: 'Regular text block',
                icon: '¶',
                keywords: ['p', 'paragraph', 'text'],
                action: () => {
                    this.insertContent('<p>Start typing your paragraph...</p>');
                }
            },
            {
                name: 'Bulleted List',
                description: 'Create a bullet list',
                icon: '•',
                keywords: ['ul', 'bullet', 'list'],
                action: () => {
                    this.insertContent('<ul><li>List item 1</li><li>List item 2</li></ul>');
                }
            },
            {
                name: 'Numbered List',
                description: 'Create a numbered list',
                icon: '1.',
                keywords: ['ol', 'number', 'list'],
                action: () => {
                    this.insertContent('<ol><li>List item 1</li><li>List item 2</li></ol>');
                }
            },
            {
                name: 'Quote',
                description: 'Insert a quote block',
                icon: '"',
                keywords: ['quote', 'blockquote'],
                action: () => {
                    this.insertContent('<blockquote>Type your quote here...</blockquote>');
                }
            },
            {
                name: 'Code Block',
                description: 'Insert advanced code block',
                icon: '</>',
                keywords: ['code', 'pre', 'snippet'],
                action: () => {
                    this.editor.plugins.get('Code').insertCodeBlock();
                }
            },
            {
                name: 'Footnote',
                description: 'Insert footnote reference',
                icon: '¹',
                keywords: ['footnote', 'ref', 'cite'],
                action: () => {
                    this.editor.plugins.get('Footnote').insertFootnote();
                }
            },
            {
                name: 'Divider',
                description: 'Horizontal line',
                icon: '—',
                keywords: ['hr', 'divider', 'line', 'separator'],
                action: () => {
                    this.editor.plugins.get('Divider').insertDivider('solid');
                }
            },
            {
                name: 'Dashed Divider',
                description: 'Dashed horizontal line',
                icon: '- -',
                keywords: ['dashed', 'separator'],
                action: () => {
                    this.editor.plugins.get('Divider').insertDivider('dashed');
                }
            },
            {
                name: 'Page Break',
                description: 'Start a new page',
                icon: '📄',
                keywords: ['page', 'break', 'new'],
                action: () => {
                    this.editor.plugins.get('PageBreak').insertPageBreak();
                }
            },
            {
                name: 'Table of Contents',
                description: 'Auto-generated TOC',
                icon: '📑',
                keywords: ['toc', 'content', 'index'],
                action: () => {
                    this.editor.plugins.get('TableOfContents').insertTOC();
                }
            },
            {
                name: 'Callout',
                description: 'Highlighted info box',
                icon: '💡',
                keywords: ['callout', 'info', 'box'],
                action: () => {
                    this.editor.plugins.get('Callout').insertCallout('info');
                }
            },
            {
                name: 'Warning',
                description: 'Warning box',
                icon: '⚠️',
                keywords: ['warning', 'alert'],
                action: () => {
                    this.editor.plugins.get('Callout').insertCallout('warning');
                }
            },
            {
                name: 'Tip',
                description: 'Green tip box',
                icon: '🟢',
                keywords: ['tip', 'success', 'hint'],
                action: () => {
                    this.editor.plugins.get('Callout').insertCallout('tip');
                }
            },
            {
                name: 'Error',
                description: 'Red error box',
                icon: '🚫',
                keywords: ['error', 'danger'],
                action: () => {
                    this.editor.plugins.get('Callout').insertCallout('error');
                }
            },
            {
                name: 'Toggle List',
                description: 'Collapsible item',
                icon: '▶',
                keywords: ['toggle', 'collapse', 'details'],
                action: () => {
                    this.editor.plugins.get('ToggleBlock').insertToggle();
                }
            },
            {
                name: 'Image',
                description: 'Insert an image',
                icon: '🖼️',
                keywords: ['image', 'img', 'picture'],
                action: () => {
                    // Get the image button from toolbar cache
                    const imageButton = this.editor.toolbar?.buttonCache?.get('image');
                    if (imageButton && imageButton.btn) {
                        // Trigger click on the button to open dialog
                        imageButton.btn.click();
                    }
                }
            },
            {
                name: 'Table',
                description: 'Insert a table',
                icon: '⊞',
                keywords: ['table', 'grid'],
                action: () => {
                    // Get the table button from toolbar cache
                    const tableButton = this.editor.toolbar?.buttonCache?.get('table');
                    if (tableButton && tableButton.btn) {
                        // Trigger click on the button to open dialog
                        tableButton.btn.click();
                    }
                }
            }
        ];
    }

    /**
     * Create menu element
     */
    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'slash-commands-menu';
        this.menu.style.cssText = `
            position: absolute;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            display: none;
            z-index: 9999;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
            pointer-events: auto;
        `;

        // Prevent menu from losing focus
        this.menu.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        document.body.appendChild(this.menu);
    }

    /**
     * Handle keydown
     */
    handleKeydown(e) {
        // Check for slash trigger
        if (e.key === this.options.trigger && !this.isVisible) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const textBefore = range.startContainer.textContent?.substring(0, range.startOffset) || '';

                // Show menu if at start of line or after space
                if (textBefore.length === 0 || textBefore.endsWith(' ')) {
                    setTimeout(() => {
                        this.triggerPosition = this.getCaretPosition();
                        this.show();
                    }, 10);
                }
            }
            return;
        }

        // Handle menu navigation
        if (this.isVisible) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
                this.renderCommands();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.renderCommands();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.executeCommand(this.filteredCommands[this.selectedIndex]);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.hide();
            } else if (e.key === 'Tab') {
                e.preventDefault();
                if (this.filteredCommands.length > 0) {
                    this.executeCommand(this.filteredCommands[0]);
                }
            }
        }
    }

    /**
     * Get caret position
     */
    getCaretPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        return {
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        };
    }

    /**
     * Show menu
     */
    show() {
        if (!this.menu || !this.triggerPosition) return;

        this.isVisible = true;
        this.selectedIndex = 0;
        this.searchQuery = '';
        this.filteredCommands = [...this.options.commands];

        // Position menu
        this.menu.style.top = `${this.triggerPosition.top + 5}px`;
        this.menu.style.left = `${this.triggerPosition.left}px`;
        this.menu.style.display = 'block';

        // Render commands
        this.renderCommands();

        // Animate in
        requestAnimationFrame(() => {
            this.menu.style.opacity = '1';
            this.menu.style.transform = 'translateY(0)';
        });
    }

    /**
     * Hide menu
     */
    hide() {
        if (!this.menu || !this.isVisible) return;

        this.menu.style.opacity = '0';
        this.menu.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            if (this.menu) {
                this.menu.style.display = 'none';
            }
        }, 200);

        this.isVisible = false;
        this.searchQuery = '';
    }

    /**
     * Update search based on input
     */
    updateSearch() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const textBefore = range.startContainer.textContent?.substring(0, range.startOffset) || '';

        // Extract search query after "/"
        const slashIndex = textBefore.lastIndexOf(this.options.trigger);
        if (slashIndex === -1) {
            this.hide();
            return;
        }

        this.searchQuery = textBefore.substring(slashIndex + 1).toLowerCase();

        // Filter commands
        if (this.searchQuery) {
            this.filteredCommands = this.options.commands.filter(cmd => {
                const searchIn = [cmd.name.toLowerCase(), ...cmd.keywords];
                return searchIn.some(text => text.includes(this.searchQuery));
            });
        } else {
            this.filteredCommands = [...this.options.commands];
        }

        this.selectedIndex = 0;
        this.renderCommands();
    }

    /**
     * Render commands in menu
     */
    renderCommands() {
        if (!this.menu) return;

        if (this.filteredCommands.length === 0) {
            this.menu.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #9ca3af;">
                    No commands found
                </div>
            `;
            return;
        }

        this.menu.innerHTML = '';

        this.filteredCommands.forEach((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'slash-command-item';
            item.dataset.index = index;

            // Function to update item style
            const updateItemStyle = (isSelected) => {
                item.style.cssText = `
                    padding: 12px 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: background 0.15s ease;
                    background: ${isSelected ? '#f3f4f6' : 'transparent'};
                `;
            };

            // Set initial style
            updateItemStyle(index === this.selectedIndex);

            item.innerHTML = `
                <div style="
                    width: 32px;
                    height: 32px;
                    background: #f3f4f6;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 600;
                    color: #6b7280;
                ">
                    ${cmd.icon}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1f2937; font-size: 14px;">${cmd.name}</div>
                    <div style="font-size: 12px; color: #6b7280;">${cmd.description}</div>
                </div>
            `;

            // Mouse hover - highlight item
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                // Update all items
                const allItems = this.menu.querySelectorAll('.slash-command-item');
                allItems.forEach((itm, idx) => {
                    itm.style.background = idx === index ? '#f3f4f6' : 'transparent';
                });
            });

            item.addEventListener('mouseleave', () => {
                // Keep selected if still hovered
                const allItems = this.menu.querySelectorAll('.slash-command-item');
                allItems.forEach((itm, idx) => {
                    itm.style.background = idx === this.selectedIndex ? '#f3f4f6' : 'transparent';
                });
            });

            // Click handler - execute command
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectedIndex = index;
                this.executeCommand(cmd);
            });

            // Prevent text selection on double-click
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
            });

            this.menu.appendChild(item);
        });

        // Auto-scroll to selected item
        this.scrollToSelected();
    }

    /**
     * Scroll to selected item in menu
     */
    scrollToSelected() {
        if (!this.menu) return;

        const selectedItem = this.menu.querySelector(`[data-index="${this.selectedIndex}"]`);
        if (selectedItem) {
            // Check if item is visible in menu
            const menuRect = this.menu.getBoundingClientRect();
            const itemRect = selectedItem.getBoundingClientRect();

            // Scroll if item is not fully visible
            if (itemRect.top < menuRect.top) {
                // Item is above visible area
                selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else if (itemRect.bottom > menuRect.bottom) {
                // Item is below visible area
                selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }

    /**
     * Execute selected command
     */
    executeCommand(command) {
        if (!command) {
            return;
        }

        // Step 1: Hide menu immediately
        this.hide();

        // Step 2: Focus editor
        this.editor.contentArea.focus();

        // Step 3: Remove slash text
        this.removeSlashText();

        // Step 4: Execute command after a brief delay to ensure DOM is ready
        setTimeout(() => {
            try {
                command.action();
            } catch (error) {
                console.error('Command execution error:', error);
            }
        }, 100);
    }

    /**
     * Remove slash trigger and search text
     */
    removeSlashText() {
        try {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                return;
            }

            const range = selection.getRangeAt(0);
            let node = range.startContainer;

            // Find text node
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Get first text node child
                for (let i = 0; i < node.childNodes.length; i++) {
                    if (node.childNodes[i].nodeType === Node.TEXT_NODE) {
                        node = node.childNodes[i];
                        break;
                    }
                }
            }

            if (node.nodeType !== Node.TEXT_NODE) {
                return;
            }

            const text = node.textContent || '';
            const slashIndex = text.lastIndexOf(this.options.trigger);

            if (slashIndex !== -1) {
                // Remove everything from slash to end
                node.textContent = text.substring(0, slashIndex);

                // Set cursor at end
                const newRange = document.createRange();
                newRange.setStart(node, slashIndex);
                newRange.collapse(true);

                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        } catch (error) {
            console.error('Error removing slash text:', error);
        }
    }

    /**
     * Insert content at cursor position
     */
    insertContent(html) {
        try {
            // Use execCommand for reliable insertion
            document.execCommand('insertHTML', false, html);

            // Trigger change event
            this.editor.trigger('change');

        } catch (error) {
            console.error('Error inserting content:', error);

            // Fallback: append to editor
            try {
                this.editor.contentArea.innerHTML += html;
            } catch (e) {
                console.error('Fallback also failed:', e);
            }
        }
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        if (this.keydownHandler) {
            this.editor.contentArea.removeEventListener('keydown', this.keydownHandler);
        }

        if (this.menu && this.menu.parentNode) {
            this.menu.remove();
        }

        this.menu = null;
        this.keydownHandler = null;
    }
}
