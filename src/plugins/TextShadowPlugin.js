import { Dialog } from '../ui/Dialog';

export class TextShadowPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'TextShadow';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('textShadow', {
            title: 'Text Shadow',
            icon: '<span style="font-size: 14px; font-weight: 600;">Shadow</span>',
            command: 'textShadow',
            onAction: (editor) => {
                this.openCustomShadowDialog();
            }
        });
    }

    openCustomShadowDialog() {
        this.editor.contentArea.focus();
        const selection = window.getSelection();

        // 1. Validation: Check if text is selected
        if (!selection.rangeCount || selection.isCollapsed) {
            alert('Please select text to apply shadow.');
            return;
        }

        const dialog = new Dialog(this.editor);

        // 2. Prepare Live Preview & Find Existing
        let liveSpan = null;
        let originalShadow = '';
        let isNewSpan = false;

        const range = selection.getRangeAt(0);

        // Check for existing shadow
        let node = selection.anchorNode;
        if (node.nodeType === 3) node = node.parentNode;

        // Walk up
        while (node && node !== this.editor.contentArea) {
            if (node.nodeName === 'SPAN' && node.style.textShadow) {
                liveSpan = node;
                originalShadow = liveSpan.style.textShadow;
                break;
            }
            node = node.parentNode;
        }

        if (!liveSpan) {
            liveSpan = document.createElement('span');
            try {
                const content = range.extractContents();
                liveSpan.appendChild(content);
                range.insertNode(liveSpan);
                range.selectNodeContents(liveSpan);
                selection.removeAllRanges();
                selection.addRange(range);
                isNewSpan = true;
            } catch (e) {
                console.error(e);
                return;
            }
        }

        // Helper to hide visual selection
        const toggleVisualSelection = (hide) => {
            if (hide) {
                this.editor.contentArea.classList.add('hide-selection');
                if (!document.getElementById('editor-hide-selection-style')) {
                    const style = document.createElement('style');
                    style.id = 'editor-hide-selection-style';
                    style.innerHTML = `.hide-selection *::selection { background: transparent !important; }`;
                    document.head.appendChild(style);
                }
            } else {
                this.editor.contentArea.classList.remove('hide-selection');
            }
        };

        toggleVisualSelection(true);

        // Default values
        let x = 2;
        let y = 2;
        let blur = 4;
        let color = '#000000';
        let opacity = 0.5;

        // PARSER: Parse existing
        if (originalShadow) {
            try {
                const parts = originalShadow.match(/(-?\d+(\.\d+)?px)/g);
                if (parts && parts.length >= 2) {
                    x = parseFloat(parts[0]);
                    y = parseFloat(parts[1]);
                    if (parts.length >= 3) blur = parseFloat(parts[2]);
                }

                const colorMatch = originalShadow.match(/rgba?\(.*?\)/);
                if (colorMatch) {
                    const rgbaStr = colorMatch[0];
                    const nums = rgbaStr.match(/(\d+(\.\d+)?)/g);
                    if (nums) {
                        const r = parseInt(nums[0]);
                        const g = parseInt(nums[1]);
                        const b = parseInt(nums[2]);
                        const a = nums.length > 3 ? parseFloat(nums[3]) : 1;

                        const toHex = (c) => {
                            const hex = c.toString(16);
                            return hex.length === 1 ? '0' + hex : hex;
                        };
                        color = '#' + toHex(r) + toHex(g) + toHex(b);
                        opacity = a;
                    }
                }
            } catch (e) {
                console.warn('Failed to parse shadow', e);
            }
        }

        const container = document.createElement('div');
        // Compact Container
        container.style.cssText = 'display: flex; flex-direction: column; gap: 6px; padding: 4px; width: 220px;';

        const createControl = (label, type, min, max, val, callback, step = 1) => {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display: flex; align-items: center; justify-content: space-between; font-size: 11px;';

            const lbl = document.createElement('span');
            lbl.textContent = label;
            lbl.style.fontWeight = '600';
            lbl.style.width = '45px';

            const input = document.createElement('input');
            input.type = type;
            if (min !== null) input.min = min;
            if (max !== null) input.max = max;
            if (step !== null) input.step = step;

            input.style.marginLeft = '5px';
            input.value = val;

            if (type === 'range') {
                input.style.flex = '1';
                input.style.height = '4px';
                input.style.cursor = 'pointer';
            } else if (type === 'color') {
                input.style.width = '25px';
                input.style.height = '18px';
                input.style.padding = '0';
                input.style.border = 'none';
                input.style.cursor = 'pointer';
            }

            input.oninput = (e) => callback(e.target.value);

            wrap.appendChild(lbl);
            wrap.appendChild(input);
            return { wrap, input };
        };

        const updatePreview = () => {
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            const rgba = `rgba(${r},${g},${b},${opacity})`;

            const shadowValue = `${x}px ${y}px ${blur}px ${rgba}`;

            // Compact Preview text
            previewBox.style.textShadow = shadowValue;

            if (liveSpan) {
                liveSpan.style.textShadow = shadowValue;
            }
        };

        const xCtrl = createControl('X', 'range', -20, 20, x, (v) => { x = v; updatePreview(); });
        const yCtrl = createControl('Y', 'range', -20, 20, y, (v) => { y = v; updatePreview(); });
        const blurCtrl = createControl('Blur', 'range', 0, 20, blur, (v) => { blur = v; updatePreview(); });

        // Compact Color + Opacity Row
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-top: 2px;';

        const cWrap = createControl('Color', 'color', null, null, color, (v) => { color = v; updatePreview(); }).wrap;
        cWrap.style.marginRight = '8px';

        const oWrap = createControl('Op', 'range', 0, 1, opacity, (v) => { opacity = v; updatePreview(); }, 0.1).wrap;
        oWrap.style.flex = '1';

        row.appendChild(cWrap);
        row.appendChild(oWrap);

        const previewBox = document.createElement('div');
        previewBox.style.cssText = 'padding: 8px; background: #fff; border: 1px dashed #ccc; text-align: center; font-size: 14px; margin-top: 4px; border-radius: 4px;';
        previewBox.textContent = 'Preview';

        container.appendChild(xCtrl.wrap);
        container.appendChild(yCtrl.wrap);
        container.appendChild(blurCtrl.wrap);
        container.appendChild(row);
        container.appendChild(previewBox);

        updatePreview();

        const footer = document.createElement('div');
        footer.style.cssText = 'display: flex; justify-content: flex-end; gap: 5px; margin-top: 8px; border-top: 1px solid #eee; padding-top: 5px;';

        const applyBtn = document.createElement('button');
        applyBtn.textContent = 'Apply';
        applyBtn.className = 'editor-dialog-btn primary';
        applyBtn.style.cssText = 'padding: 3px 8px; font-size: 11px;';
        applyBtn.onclick = () => {
            this.editor.trigger('change');
            dialog.close();
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'editor-dialog-btn';
        cancelBtn.style.cssText = 'padding: 3px 8px; font-size: 11px;';
        cancelBtn.onclick = () => {
            if (liveSpan) {
                if (isNewSpan) {
                    const parent = liveSpan.parentNode;
                    while (liveSpan.firstChild) parent.insertBefore(liveSpan.firstChild, liveSpan);
                    parent.removeChild(liveSpan);
                } else {
                    liveSpan.style.textShadow = originalShadow;
                }
            }
            dialog.close();
        };

        footer.appendChild(cancelBtn);
        footer.appendChild(applyBtn);
        container.appendChild(footer);

        dialog.show({
            title: 'Custom Shadow',
            content: '',
            draggable: true,
            transparent: true,
            onClose: () => toggleVisualSelection(false)
        });
        dialog.body.innerHTML = '';
        dialog.body.appendChild(container);
    }
}
