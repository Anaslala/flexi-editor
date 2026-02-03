export class ColorPicker {
    constructor(editor, onSelect) {
        this.editor = editor;
        this.onSelect = onSelect;
        this.element = null;
        this.overlay = null;
        this.activeColor = '#000000';
        // HSV state
        this.hue = 0;
        this.saturation = 0;
        this.value = 0; // Brightness

        this.presets = [
            '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
            '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
            '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
            '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
            '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
            '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79'
        ];
    }

    show(targetElement) {
        this.close();

        // Create Overlay for clicking outside
        this.overlay = document.createElement('div');
        this.overlay.className = 'editor-color-overlay';
        this.overlay.onclick = () => this.close();
        document.body.appendChild(this.overlay);

        // Create Popover
        this.element = document.createElement('div');
        this.element.className = 'editor-color-picker';

        // Position
        const rect = targetElement.getBoundingClientRect();
        this.element.style.top = `${rect.bottom + 8}px`;
        this.element.style.left = `${rect.left}px`;

        // 1. Search / Input
        const header = document.createElement('div');
        header.className = 'editor-color-header';

        const searchIcon = document.createElement('span');
        searchIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Try "blue" or "#00c4cc"';
        input.className = 'editor-color-search';

        const handleSearch = (val) => {
            // Trim whitespace
            val = val.trim();
            if (!val) return;

            // Validate color
            const s = new Option().style;
            s.color = val;

            if (s.color !== '') {
                // If valid color, we can either select immediately OR show it as pending
                // Ideally, we show it on the "Add" button or a preview
                this.activeColor = val;

                // Update Add Button to show this color
                addBtn.style.background = val;
                addBtn.style.backgroundImage = 'none'; // remove gradient

                return true;
            }
            return false;
        };

        const executeSearch = (val) => {
            if (handleSearch(val)) {
                this.selectColor(val);
            }
        };

        input.addEventListener('input', (e) => handleSearch(e.target.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') executeSearch(e.target.value);
        });

        // Make icon clickable
        searchIcon.onclick = () => executeSearch(input.value);
        searchIcon.style.cursor = 'pointer';

        header.appendChild(searchIcon);
        header.appendChild(input);
        this.element.appendChild(header);

        // 2. Document Colors Label
        const label = document.createElement('div');
        label.className = 'editor-color-label';
        label.textContent = 'Document Colors';
        this.element.appendChild(label);

        // 3. Add Button (Gradient) & Current
        const docColors = document.createElement('div');
        docColors.className = 'editor-color-doc-row';

        const addBtn = document.createElement('button');
        addBtn.className = 'editor-color-add-btn';
        addBtn.innerHTML = '+';
        addBtn.title = 'Add custom color';
        addBtn.onclick = (e) => this.toggleAdvancedPicker(e, addBtn);

        docColors.appendChild(addBtn);
        this.element.appendChild(docColors);

        // 4. Presets Grid
        const grid = document.createElement('div');
        grid.className = 'editor-color-grid';

        this.presets.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'editor-color-swatch';
            btn.style.backgroundColor = color;
            btn.onclick = () => this.selectColor(color);
            grid.appendChild(btn);
        });

        this.element.appendChild(grid);
        document.body.appendChild(this.element);

        // Adjust position if off-screen
        const pickerRect = this.element.getBoundingClientRect();
        if (pickerRect.right > window.innerWidth) {
            this.element.style.left = `${window.innerWidth - pickerRect.width - 20}px`;
        }
    }

    toggleAdvancedPicker(e, target) {
        if (this.advancedPicker) {
            // If dragging, don't remove
            if (this.isDraggingSV) return;

            this.advancedPicker.remove();
            this.advancedPicker = null;
            return;
        }

        this.advancedPicker = document.createElement('div');
        this.advancedPicker.className = 'editor-advanced-color-picker';

        // Initialize HSV from active color
        const hsv = this.getHSVFromColor(this.activeColor);
        this.hue = hsv.h;
        this.saturation = hsv.s;
        this.value = hsv.v;

        // Gradient Canvas (Saturation/Brightness)
        const svCanvas = document.createElement('div');
        svCanvas.className = 'editor-color-sv';
        svCanvas.style.backgroundColor = `hsl(${this.hue}, 100%, 50%)`;

        const whiteGrad = document.createElement('div');
        whiteGrad.className = 'editor-color-sv-white';
        const blackGrad = document.createElement('div');
        blackGrad.className = 'editor-color-sv-black';

        const cursor = document.createElement('div');
        cursor.className = 'editor-color-sv-cursor';

        // Position cursor based on Saturation/Value
        // Saturation 0-100 -> Left 0-100%
        // Value 100-0 -> Top 0-100%
        cursor.style.left = `${this.saturation}%`;
        cursor.style.top = `${100 - this.value}%`;

        svCanvas.appendChild(whiteGrad);
        svCanvas.appendChild(blackGrad);
        svCanvas.appendChild(cursor);
        this.advancedPicker.appendChild(svCanvas);

        // Handling Drag on SV Canvas
        const updateSV = (clientX, clientY) => {
            const rect = svCanvas.getBoundingClientRect();
            let x = clientX - rect.left;
            let y = clientY - rect.top;

            x = Math.max(0, Math.min(x, rect.width));
            y = Math.max(0, Math.min(y, rect.height));

            const sat = (x / rect.width) * 100;
            const val = 100 - ((y / rect.height) * 100);

            this.saturation = sat;
            this.value = val;

            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;

            this.updateColorFromHSV();
        };

        const onMouseDown = (e) => {
            e.preventDefault();
            this.isDraggingSV = true;
            updateSV(e.clientX, e.clientY);

            const onMouseMove = (ev) => updateSV(ev.clientX, ev.clientY);
            const onMouseUp = () => {
                this.isDraggingSV = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        svCanvas.addEventListener('mousedown', onMouseDown);


        // Hue Slider
        const hueSlider = document.createElement('input');
        hueSlider.type = 'range';
        hueSlider.min = 0;
        hueSlider.max = 360;
        hueSlider.value = this.hue;
        hueSlider.className = 'editor-color-hue-slider';
        hueSlider.addEventListener('input', (e) => {
            this.hue = e.target.value;
            svCanvas.style.backgroundColor = `hsl(${this.hue}, 100%, 50%)`;
            this.updateColorFromHSV();
        });
        this.advancedPicker.appendChild(hueSlider);

        // RGB / Hex Inputs
        const inputsRow = document.createElement('div');
        inputsRow.className = 'editor-color-inputs-row';

        const hexInput = document.createElement('input');
        hexInput.value = this.activeColor;
        hexInput.className = 'editor-color-hex-input';
        // Allow manual editing of Hex
        hexInput.addEventListener('change', (e) => {
            // Basic validation
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                this.activeColor = e.target.value;
                // Ideally we update HSV here too, but for simplicity just setting active color
            }
        });

        const eyeDropperBtn = document.createElement('button');
        eyeDropperBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;
        eyeDropperBtn.className = 'editor-color-eyedropper';

        if (window.EyeDropper) {
            eyeDropperBtn.onclick = async () => {
                try {
                    const eyeDropper = new EyeDropper();
                    const result = await eyeDropper.open();
                    // Set color logic
                    this.activeColor = result.sRGBHex;
                    hexInput.value = this.activeColor;
                    // Trigger select? Or just update UI?
                    // Usually eyedropper confirms selection immediately.
                } catch (e) {
                    // Canceled
                }
            };
        } else {
            eyeDropperBtn.style.display = 'none';
        }

        // Confirm Button for Custom Color
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'editor-color-eyedropper'; // reuse style
        confirmBtn.style.width = 'auto';
        confirmBtn.style.padding = '0 8px';
        confirmBtn.innerHTML = '✔';
        confirmBtn.title = 'Apply Color';
        confirmBtn.onclick = () => this.selectColor(this.activeColor);

        inputsRow.appendChild(eyeDropperBtn);
        inputsRow.appendChild(hexInput);
        inputsRow.appendChild(confirmBtn);
        this.advancedPicker.appendChild(inputsRow);

        this.element.insertBefore(this.advancedPicker, this.element.querySelector('.editor-color-grid'));

        // Save references
        this.hexInput = hexInput;
    }

    updateColorFromHSV() {
        const h = this.hue;
        const s = this.saturation / 100;
        const v = this.value / 100;

        const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

        const r = Math.round(f(5) * 255);
        const g = Math.round(f(3) * 255);
        const b = Math.round(f(1) * 255);

        const toHex = (c) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        this.activeColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

        if (this.hexInput) {
            this.hexInput.value = this.activeColor.toUpperCase();
        }
    }

    // Helper to get HSV from any valid color string
    getHSVFromColor(color) {
        // Use browser to resolve color name/hex to rgb
        const div = document.createElement('div');
        div.style.color = color;
        document.body.appendChild(div);
        const computed = window.getComputedStyle(div).color;
        document.body.removeChild(div);

        // Parse rgb(r, g, b)
        const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return { h: 0, s: 100, v: 100 }; // fallback

        const r = parseInt(match[1]) / 255;
        const g = parseInt(match[2]) / 255;
        const b = parseInt(match[3]) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, v = max;

        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    selectColor(color) {
        if (this.onSelect) this.onSelect(color);
        this.close();
    }

    close() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
}
