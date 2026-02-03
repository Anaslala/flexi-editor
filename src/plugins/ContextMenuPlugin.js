import { Icons } from '../ui/Icons';

export class ContextMenuPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'ContextMenu';
        this.menu = null;
        this.isVisible = false;
    }

    init() {
        // Create Menu Element (Hidden by default)
        this.createMenu();

        // Inject Styles
        this.injectStyles();

        // Listen for Right Click - USE WRAPPER or ELEMENT and CAPTURE to preempt interactions
        const target = this.editor.wrapper || this.editor.element || this.editor.contentArea;

        // Remove previous listener if hot-reloading
        if (this._contextHandler) {
            target.removeEventListener('contextmenu', this._contextHandler, true);
        }

        this._contextHandler = (e) => this.handleContextMenu(e);
        target.addEventListener('contextmenu', this._contextHandler, true); // true = Capture Phase

        // Close on Click/Scroll
        document.addEventListener('click', () => this.hideMenu());
        // Handle window scroll/resize to close menu
        window.addEventListener('scroll', () => this.hideMenu(), true);
        window.addEventListener('resize', () => this.hideMenu());
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fe-context-menu {
                position: fixed;
                z-index: 10000;
                background: #161b22;
                border: 1px solid #30363d;
                border-radius: 6px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                padding: 4px;
                min-width: 180px;
                display: none;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            }
            .fe-context-menu.active {
                display: flex;
                animation: fe-fade-in 0.1s ease-out;
            }
            .fe-context-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 6px 12px;
                cursor: pointer;
                color: #c9d1d9;
                font-size: 13px;
                border-radius: 4px;
                transition: background 0.1s;
                user-select: none;
            }
            .fe-context-item:hover {
                background: #1f6feb;
                color: white;
            }
            .fe-context-item svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
                opacity: 0.8;
            }
            .fe-context-divider {
                height: 1px;
                background: #30363d;
                margin: 4px 0;
            }
            .fe-context-shortcut {
                margin-left: auto;
                font-size: 11px;
                opacity: 0.5;
            }
            @keyframes fe-fade-in {
                from { opacity: 0; transform: scale(0.98); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    createMenu() {
        this.menu = document.createElement('div');
        this.menu.className = 'fe-context-menu';
        document.body.appendChild(this.menu);
    }

    handleContextMenu(e) {
        e.preventDefault(); // Stop Browser Menu

        // Get selection to decide what to show?
        // For now, standard menu
        this.renderItems();

        // Position
        const x = e.clientX;
        const y = e.clientY;

        // Adjust if close to edge
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;

        this.showMenu();
    }

    renderItems() {
        // Selection State
        const hasSelection = !window.getSelection().isCollapsed;

        // Icons (Inline SVG for reliability if FontAwesome/Icons module missing specific ones)
        // Using editor.execCommand wrapper

        const items = [
            { label: 'Cut', icon: Icons.cut || '✂️', action: 'cut', disabled: !hasSelection },
            { label: 'Copy', icon: Icons.copy || 'cX', action: 'copy', disabled: !hasSelection },
            { label: 'Paste', icon: Icons.paste || 'pV', action: 'paste' },
            { divider: true },
            { label: 'Bold', icon: Icons.bold || 'B', action: 'bold', shortcut: 'Ctrl+B' },
            { label: 'Italic', icon: Icons.italic || 'I', action: 'italic', shortcut: 'Ctrl+I' },
            { label: 'Underline', icon: Icons.underline || 'U', action: 'underline', shortcut: 'Ctrl+U' },
            { divider: true },
            { label: 'Select All', icon: '⛶', action: 'selectAll', shortcut: 'Ctrl+A' },
            { label: 'Clear Formatting', icon: '🧹', action: 'removeFormat' }
        ];

        this.menu.innerHTML = '';

        items.forEach(item => {
            if (item.divider) {
                const div = document.createElement('div');
                div.className = 'fe-context-divider';
                this.menu.appendChild(div);
                return;
            }

            const el = document.createElement('div');
            el.className = 'fe-context-item';
            if (item.disabled) {
                el.style.opacity = '0.5';
                el.style.pointerEvents = 'none';
            }

            // Icon
            const iconSpan = document.createElement('span');
            iconSpan.innerHTML = typeof item.icon === 'string' ? item.icon : ''; // If SVG string
            if (typeof item.icon !== 'string') {
                // Assuming Icons object returns SVG strings usually
            }

            // Label
            const textSpan = document.createElement('span');
            textSpan.textContent = item.label;

            // Shortcut
            const shortcutSpan = document.createElement('span');
            shortcutSpan.className = 'fe-context-shortcut';
            shortcutSpan.textContent = item.shortcut || '';

            el.append(iconSpan, textSpan, shortcutSpan);

            el.onclick = (e) => {
                e.stopPropagation();
                this.execute(item.action);
                this.hideMenu();
            };

            this.menu.appendChild(el);
        });
    }

    execute(action) {
        this.editor.contentArea.focus(); // Ensure focus back to editor

        switch (action) {
            case 'paste':
                // Paste is tricky due to permissions. Try execCommand first.
                // Modern browsers might block this.
                // Modern browsers might block this.
                if (navigator.clipboard && navigator.clipboard.readText) {
                    navigator.clipboard.readText()
                        .then(text => {
                            this.editor.contentArea.focus(); // Focus First!
                            document.execCommand('insertText', false, text);
                        })
                        .catch(err => {
                            console.error('Paste failed', err);
                            alert('Browser blocked paste. Use Ctrl+V');
                        });
                } else {
                    alert('Paste not supported. Use Ctrl+V');
                }
                break;
            case 'copy':
                document.execCommand('copy');
                break;
            case 'cut':
                document.execCommand('cut');
                break;
            default:
                this.editor.execCommand(action);
                break;
        }
    }

    showMenu() {
        this.isVisible = true;
        this.menu.classList.add('active');
    }

    hideMenu() {
        if (this.isVisible) {
            this.isVisible = false;
            this.menu.classList.remove('active');
        }
    }
}
