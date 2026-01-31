import { Icons } from '../ui/Icons';
import { Dialog } from '../ui/Dialog';
import { googleFonts } from '../data/googleFonts';

export class FontPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Font';
        this.loadedFonts = new Set();
    }

    init() {
        if (!this.editor.toolbar) return;

        // Font Family Button
        this.editor.toolbar.registerButton('fontName', {
            title: 'Select Font Family',
            icon: Icons.font,
            command: 'fontName',
            onAction: (editor) => {
                this.showFontPickerDialog(editor);
            }
        });

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

        // Check if we should apply to the BLOCK directly
        let appliedToBlock = false;
        if (block && range.toString().trim() === block.textContent.trim()) {
            block.style.fontSize = sizePx;
            appliedToBlock = true;

            // Cleanup inner spans that might conflict
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

    showFontPickerDialog(editor) {
        const dialog = new Dialog(editor);
        const container = document.createElement('div');
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search Fonts...';
        searchInput.style.cssText = 'width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc;';

        const list = document.createElement('div');
        list.style.cssText = 'max-height:300px; overflow-y:auto; border:1px solid #eee;';

        const renderList = (filter = '') => {
            list.innerHTML = '';
            googleFonts.filter(f => f.toLowerCase().includes(filter.toLowerCase())).forEach(font => {
                const item = document.createElement('div');
                item.textContent = font;
                item.style.cssText = 'padding:8px; cursor:pointer; border-bottom:1px solid #f9f9f9;';
                item.onclick = async () => {
                    await this.loadFont(font);
                    editor.selection.restoreSelection();
                    editor.execCommand('fontName', font);
                    dialog.close();
                };
                list.appendChild(item);
            });
        };
        renderList();
        searchInput.onkeyup = (e) => renderList(e.target.value);
        container.appendChild(searchInput);
        container.appendChild(list);
        dialog.show({ title: 'Fonts', content: '' });
        dialog.body.innerHTML = '';
        dialog.body.appendChild(container);
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
