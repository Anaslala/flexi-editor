/**
 * CalloutPlugin
 * 
 * Inserts colored callout boxes for emphasis.
 * 
 * Types:
 * - info (Blue ℹ️)
 * - tip (Green 💡)
 * - warning (Yellow ⚠️)
 * - error (Red 🚫)
 * - success (Green ✅)
 */

export class CalloutPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Callout';
    }

    init() {
        // Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            .fe-callout {
                padding: 16px;
                border-radius: 8px;
                display: flex;
                gap: 12px;
                margin: 16px 0;
                border: 1px solid transparent;
            }
            .fe-callout-icon {
                font-size: 20px;
                flex-shrink: 0;
                user-select: none;
            }
            .fe-callout-content {
                flex: 1;
                min-width: 0; /* Flex fix */
            }
            .fe-callout-content p {
                margin: 0;
            }
            
            /* Themes */
            .fe-callout-info {
                background: #eff6ff;
                border-color: #dbeafe;
                color: #1e40af;
            }
            .fe-callout-tip {
                background: #ecfccb;
                border-color: #d9f99d;
                color: #365314;
            }
            .fe-callout-warning {
                background: #fffbeb;
                border-color: #fde68a;
                color: #92400e;
            }
            .fe-callout-error {
                background: #fef2f2;
                border-color: #fecaca;
                color: #991b1b;
            }
            .fe-callout-success {
                background: #f0fdf4;
                border-color: #bbf7d0;
                color: #166534;
            }
        `;
        document.head.appendChild(style);
    }

    insertCallout(type = 'info') {
        const config = {
            info: { icon: 'ℹ️', class: 'fe-callout-info' },
            tip: { icon: '💡', class: 'fe-callout-tip' },
            warning: { icon: '⚠️', class: 'fe-callout-warning' },
            error: { icon: '🚫', class: 'fe-callout-error' },
            success: { icon: '✅', class: 'fe-callout-success' }
        };

        const theme = config[type] || config.info;

        const callout = document.createElement('div');
        callout.className = `fe-callout ${theme.class}`;
        callout.innerHTML = `
            <span class="fe-callout-icon" contenteditable="false">${theme.icon}</span>
            <div class="fe-callout-content"><p>Type something...</p></div>
        `;

        this.editor.execCommand('insertHTML', callout.outerHTML + '<p><br></p>');
    }
}
