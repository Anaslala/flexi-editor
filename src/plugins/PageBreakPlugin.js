/**
 * PageBreakPlugin
 * 
 * Inserts a page break marker.
 * Useful for Print/PDF generation.
 */

export class PageBreakPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'PageBreak';
    }

    init() {
        // Inject Print Styles
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                .fe-page-break {
                    page-break-after: always;
                    height: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                    visibility: hidden;
                }
            }
            .fe-page-break {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 40px 0;
                color: #9ca3af;
                font-size: 12px;
                font-family: sans-serif;
                text-transform: uppercase;
                letter-spacing: 1px;
                user-select: none;
                position: relative;
            }
            .fe-page-break::before,
            .fe-page-break::after {
                content: '';
                flex: 1;
                border-bottom: 2px dashed #e5e7eb;
            }
            .fe-page-break span {
                margin: 0 16px;
                background: #f3f4f6;
                padding: 4px 8px;
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    insertPageBreak() {
        const breakEl = document.createElement('div');
        breakEl.className = 'fe-page-break';
        breakEl.contentEditable = 'false';
        breakEl.innerHTML = '<span>Page Break</span>';

        this.editor.execCommand('insertHTML', breakEl.outerHTML + '<p><br></p>');
    }
}
