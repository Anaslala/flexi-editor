/**
 * ToggleBlockPlugin
 * 
 * Inserts collapsible specific sections (Accordion style).
 * Uses native <details> and <summary> tags.
 */

export class ToggleBlockPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'ToggleBlock';
    }

    init() {
        // Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            .fe-toggle-block {
                margin: 10px 0;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                overflow: hidden;
            }
            .fe-toggle-block[open] {
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .fe-toggle-summary {
                padding: 12px 16px;
                background: #f9fafb;
                cursor: pointer;
                font-weight: 500;
                list-style: none; /* Hide default triangle */
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s;
            }
            .fe-toggle-summary:hover {
                background: #f3f4f6;
            }
            .fe-toggle-summary::-webkit-details-marker {
                display: none;
            }
            
            /* Custom Triangle */
            .fe-toggle-summary::before {
                content: '▶';
                font-size: 10px;
                color: #6b7280;
                transition: transform 0.2s;
            }
            .fe-toggle-block[open] .fe-toggle-summary::before {
                transform: rotate(90deg);
            }

            .fe-toggle-content {
                padding: 16px;
                border-top: 1px solid #e5e7eb;
                background: white;
            }
            .fe-toggle-content p {
                 margin-top: 0;
            }
        `;
        document.head.appendChild(style);
    }

    insertToggle() {
        const details = document.createElement('details');
        details.className = 'fe-toggle-block';
        details.open = true; // Open by default for editing

        details.innerHTML = `
            <summary class="fe-toggle-summary">Toggle Title</summary>
            <div class="fe-toggle-content"><p>Hidden content inside...</p></div>
        `;

        this.editor.execCommand('insertHTML', details.outerHTML + '<p><br></p>');
    }
}
