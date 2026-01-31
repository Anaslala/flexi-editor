import { googleFonts } from '../data/googleFonts';

export class FontPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Font';
        this.loadedFonts = new Set();
        this.customFonts = [];
    }

    init() {
        if (!this.editor.toolbar) return;

        // Font Family Dropdown with Search
        this.createFontFamilyDropdown();

        // Font Size Number Input
        this.editor.toolbar.registerButton('fontSizePx', {
            type: 'number',
            width: '60px',
            placeholder: '16',
            min: '10',
            max: '100',
            value: '16',
            title: 'Font Size (px)',
            onAction: (editor, value) => {
                if (value) this.applyFontSize(value);
            }
        });
    }

    createFontFamilyDropdown() {
        const wrapper = document.createElement('div');
        wrapper.className = 'editor-toolbar-font-dropdown-wrapper';
        wrapper.style.cssText = 'position: relative; display: inline-block;';

        // Dropdown Button
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'editor-toolbar-btn editor-font-dropdown-btn';
        button.innerHTML = `
            <span class="editor-font-current">Default Font</span>
            <svg width="10" height="6" viewBox="0 0 10 6" style="margin-left: 6px;">
                <path fill="currentColor" d="M0 0l5 6 5-6z"/>
            </svg>
        `;
        button.title = 'Font Family';
        button.style.cssText = `
            min-width: 140px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
        `;

        // Dropdown Panel
        const panel = document.createElement('div');
        panel.className = 'editor-font-dropdown-panel';
        panel.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            margin-top: 4px;
            background: white;
            border: 1px solid #c4c4c4;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            width: 280px;
            max-height: 400px;
            display: none;
            z-index: 1000;
            flex-direction: column;
        `;

        // Search Input
        const searchWrapper = document.createElement('div');
        searchWrapper.style.cssText = 'padding: 8px; border-bottom: 1px solid #e5e7eb;';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search fonts...';
        searchInput.className = 'editor-font-search';
        searchInput.style.cssText = `
            width: 100%;
            padding: 6px 10px;
            border: 1px solid #c4c4c4;
            border-radius: 3px;
            font-size: 13px;
            outline: none;
        `;
        searchInput.onfocus = () => {
            searchInput.style.borderColor = '#1b9af7';
            searchInput.style.boxShadow = '0 0 0 1px #1b9af7';
        };
        searchInput.onblur = () => {
            searchInput.style.borderColor = '#c4c4c4';
            searchInput.style.boxShadow = 'none';
        };
        searchWrapper.appendChild(searchInput);

        // Add Custom Font Button
        const addCustomBtn = document.createElement('button');
        addCustomBtn.type = 'button';
        addCustomBtn.textContent = '+ Add Custom Font';
        addCustomBtn.style.cssText = `
            width: 100%;
            padding: 8px;
            border: none;
            background: #f3f4f6;
            color: #1b9af7;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            border-bottom: 1px solid #e5e7eb;
            transition: background 0.2s;
        `;
        addCustomBtn.onmouseenter = () => addCustomBtn.style.background = '#e5e7eb';
        addCustomBtn.onmouseleave = () => addCustomBtn.style.background = '#f3f4f6';
        addCustomBtn.onclick = () => this.showAddCustomFontDialog();

        // Font List
        const fontList = document.createElement('div');
        fontList.className = 'editor-font-list';
        fontList.style.cssText = `
            overflow-y: auto;
            max-height: 300px;
            padding: 4px 0;
        `;

        const renderFonts = (filter = '') => {
            fontList.innerHTML = '';
            
            // Default option
            const defaultItem = this.createFontItem('Default Font', 'default', button, panel);
            fontList.appendChild(defaultItem);

            // Custom fonts
            if (this.customFonts.length > 0) {
                const customHeader = document.createElement('div');
                customHeader.textContent = 'Custom Fonts';
                customHeader.style.cssText = `
                    padding: 8px 12px 4px;
                    font-size: 11px;
                    font-weight: 700;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                `;
                fontList.appendChild(customHeader);

                this.customFonts
                    .filter(f => f.toLowerCase().includes(filter.toLowerCase()))
                    .forEach(font => {
                        const item = this.createFontItem(font, font, button, panel);
                        fontList.appendChild(item);
                    });
            }

            // Google Fonts
            const googleHeader = document.createElement('div');
            googleHeader.textContent = 'Google Fonts';
            googleHeader.style.cssText = `
                padding: 8px 12px 4px;
                font-size: 11px;
                font-weight: 700;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;
            fontList.appendChild(googleHeader);

            googleFonts
                .filter(f => f.toLowerCase().includes(filter.toLowerCase()))
                .slice(0, 50)
                .forEach(font => {
                    const item = this.createFontItem(font, font, button, panel);
                    fontList.appendChild(item);
                });
        };

        searchInput.oninput = (e) => renderFonts(e.target.value);

        // Toggle dropdown
        button.onclick = (e) => {
            e.stopPropagation();
            const isOpen = panel.style.display === 'flex';
            panel.style.display = isOpen ? 'none' : 'flex';
            if (!isOpen) {
                renderFonts();
                setTimeout(() => searchInput.focus(), 50);
            }
        };

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                panel.style.display = 'none';
            }
        });

        panel.appendChild(searchWrapper);
        panel.appendChild(addCustomBtn);
        panel.appendChild(fontList);
        wrapper.appendChild(button);
        wrapper.appendChild(panel);

        this.editor.toolbar.element.appendChild(wrapper);
    }

    createFontItem(displayName, fontFamily, button, panel) {
        const item = document.createElement('div');
        item.textContent = displayName;
        item.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            font-size: 13px;
            transition: background 0.15s;
            font-family: ${fontFamily === 'default' ? 'inherit' : `'${fontFamily}', sans-serif`};
        `;
        
        item.onmouseenter = () => {
            item.style.background = '#f3f4f6';
        };
        item.onmouseleave = () => {
            item.style.background = 'transparent';
        };

        item.onclick = async () => {
            if (fontFamily !== 'default') {
                await this.loadFont(fontFamily);
            }
            this.applyFontFamily(fontFamily === 'default' ? '' : fontFamily);
            button.querySelector('.editor-font-current').textContent = displayName;
            panel.style.display = 'none';
        };

        return item;
    }

    showAddCustomFontDialog() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            border-radius: 4px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            width: 400px;
            max-width: 90vw;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 700;
            font-size: 14px;
        `;
        header.textContent = 'Add Custom Font';

        const body = document.createElement('div');
        body.style.cssText = 'padding: 16px;';

        const label = document.createElement('label');
        label.textContent = 'Font Family Name';
        label.style.cssText = `
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            font-weight: 600;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'e.g., Arial, Helvetica, Custom Font';
        input.style.cssText = `
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #c4c4c4;
            border-radius: 3px;
            font-size: 13px;
            outline: none;
        `;
        input.onfocus = () => {
            input.style.borderColor = '#1b9af7';
            input.style.boxShadow = '0 0 0 1px #1b9af7';
        };
        input.onblur = () => {
            input.style.borderColor = '#c4c4c4';
            input.style.boxShadow = 'none';
        };

        const hint = document.createElement('div');
        hint.textContent = 'Enter the exact font family name. Make sure the font is loaded via CSS.';
        hint.style.cssText = `
            margin-top: 6px;
            font-size: 11px;
            color: #6b7280;
        `;

        body.appendChild(label);
        body.appendChild(input);
        body.appendChild(hint);

        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 12px 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.type = 'button';
        cancelBtn.style.cssText = `
            padding: 8px 16px;
            border: 1px solid #c4c4c4;
            background: white;
            border-radius: 3px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        cancelBtn.onmouseenter = () => cancelBtn.style.background = '#f3f4f6';
        cancelBtn.onmouseleave = () => cancelBtn.style.background = 'white';
        cancelBtn.onclick = () => overlay.remove();

        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add Font';
        addBtn.type = 'button';
        addBtn.style.cssText = `
            padding: 8px 16px;
            border: 1px solid #1b9af7;
            background: #1b9af7;
            color: white;
            border-radius: 3px;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
        `;
        addBtn.onmouseenter = () => addBtn.style.background = '#1a8cd8';
        addBtn.onmouseleave = () => addBtn.style.background = '#1b9af7';
        addBtn.onclick = () => {
            const fontName = input.value.trim();
            if (fontName && !this.customFonts.includes(fontName)) {
                this.customFonts.push(fontName);
                overlay.remove();
            }
        };

        footer.appendChild(cancelBtn);
        footer.appendChild(addBtn);

        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        setTimeout(() => input.focus(), 50);

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }

    applyFontFamily(fontFamily) {
        this.editor.contentArea.focus();
        this.editor.selection.restoreSelection();

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        if (range.collapsed) {
            const span = document.createElement('span');
            span.style.fontFamily = fontFamily || '';
            span.innerHTML = '&#8203;';
            range.insertNode(span);
            range.setStart(span, 1);
            range.setEnd(span, 1);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }

        const span = document.createElement('span');
        span.style.fontFamily = fontFamily || '';

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (e) {
            console.error('Font family apply error', e);
        }

        this.editor.trigger('change');
    }

    applyFontSize(size) {
        let sizePx = size;
        if (!sizePx.endsWith('px')) {
            sizePx += 'px';
        }

        this.editor.contentArea.focus();
        this.editor.selection.restoreSelection();

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const anchor = selection.anchorNode;
        const element = anchor.nodeType === 3 ? anchor.parentNode : anchor;
        const block = element.closest('p, h1, h2, h3, h4, h5, h6, div, li, blockquote');

        let appliedToBlock = false;
        if (block && range.toString().trim() === block.textContent.trim()) {
            block.style.fontSize = sizePx;
            appliedToBlock = true;

            const spans = block.querySelectorAll('span[style*="font-size"]');
            spans.forEach(s => s.style.fontSize = '');
        }

        if (appliedToBlock) {
            this.editor.trigger('change');
            return;
        }

        if (range.collapsed) {
            const span = document.createElement('span');
            span.style.fontSize = sizePx;
            span.innerHTML = '&#8203;';
            range.insertNode(span);
            range.setStart(span, 1);
            range.setEnd(span, 1);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }

        const span = document.createElement('span');
        span.style.fontSize = sizePx;

        try {
            const content = range.extractContents();
            span.appendChild(content);
            range.insertNode(span);
            range.selectNodeContents(span);
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (e) {
            console.error('Font size apply error', e);
        }

        this.editor.trigger('change');
    }

    loadFont(fontName) {
        if (this.loadedFonts.has(fontName)) return Promise.resolve();
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css?family=${fontName.replace(/\s+/g, '+')}&display=swap`;
            link.rel = 'stylesheet';
            link.onload = () => { this.loadedFonts.add(fontName); resolve(); };
            link.onerror = resolve;
            document.head.appendChild(link);
        });
    }
}
