export class Toolbar {
    constructor(editor, element) {
        this.editor = editor;
        this.element = element || document.createElement('div');
        this.element.className = 'editor-toolbar';
        this.registry = new Map();
        this.buttonCache = new Map();
        this.eventListeners = [];

        // Render initially empty
        this.render();

        // Bind update on selection change with debouncing
        this.updateDebounceTimer = null;
        const debouncedUpdate = () => {
            if (this.updateDebounceTimer) {
                clearTimeout(this.updateDebounceTimer);
            }
            this.updateDebounceTimer = setTimeout(() => {
                this.updateActiveStates();
            }, 50);
        };

        this.editor.on('selection-change', debouncedUpdate);
        this.editor.on('mouseup', debouncedUpdate);
        this.editor.on('keyup', debouncedUpdate);
    }

    registerButton(id, config) {
        this.registry.set(id, config);
        this.addButtonToDOM(id, config);
    }

    addButtonToDOM(id, config) {
        if (config.type === 'separator') {
            const sep = document.createElement('div');
            sep.className = 'editor-toolbar-separator';
            sep.dataset.id = id;
            this.element.appendChild(sep);
            return;
        }

        if (config.type === 'color') {
            const wrapper = document.createElement('div');
            wrapper.className = 'editor-toolbar-color-wrapper';
            wrapper.dataset.id = id;

            const btn = document.createElement('button');
            btn.className = 'editor-toolbar-btn';
            btn.innerHTML = config.icon;
            btn.title = config.title;
            btn.type = 'button';

            const input = document.createElement('input');
            input.type = 'color';
            input.className = 'editor-toolbar-color-input';
            input.value = config.value || '#000000';

            const btnClickHandler = () => input.click();
            btn.addEventListener('click', btnClickHandler);
            this.eventListeners.push({ element: btn, event: 'click', handler: btnClickHandler });

            const inputHandler = (e) => {
                if (config.onAction) {
                    config.onAction(this.editor, e.target.value);
                }
            };
            input.addEventListener('input', inputHandler);
            this.eventListeners.push({ element: input, event: 'input', handler: inputHandler });

            wrapper.appendChild(btn);
            wrapper.appendChild(input);
            this.element.appendChild(wrapper);
            this.buttonCache.set(id, { wrapper, btn, input });
            return;
        }

        if (config.type === 'select') {
            const wrapper = document.createElement('div');
            wrapper.className = 'editor-toolbar-select-wrapper';
            wrapper.dataset.id = id;

            const select = document.createElement('select');
            select.className = 'editor-toolbar-select';
            select.setAttribute('aria-label', config.title || id);

            config.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.text;
                select.appendChild(option);
            });

            const changeHandler = (e) => {
                if (config.onAction) {
                    config.onAction(this.editor, e.target.value);
                }
            };
            select.addEventListener('change', changeHandler);
            this.eventListeners.push({ element: select, event: 'change', handler: changeHandler });

            const mousedownHandler = () => {
                this.editor.selection.saveSelection();
            };
            select.addEventListener('mousedown', mousedownHandler);
            this.eventListeners.push({ element: select, event: 'mousedown', handler: mousedownHandler });

            if (config.checkActive) {
                const updateSelect = () => {
                    const val = config.checkActive(this.editor);
                    if (val) select.value = val;
                };
                this.editor.on('selection-change', updateSelect);
                this.editor.on('mouseup', updateSelect);
            }

            wrapper.appendChild(select);
            this.element.appendChild(wrapper);
            this.buttonCache.set(id, { wrapper, select });
            return;
        }

        if (config.type === 'input' || config.type === 'number') {
            const wrapper = document.createElement('div');
            wrapper.className = 'editor-toolbar-input-wrapper';
            wrapper.dataset.id = id;

            const input = document.createElement('input');
            input.type = config.type === 'number' ? 'number' : 'text';
            input.className = 'editor-toolbar-input';
            input.setAttribute('aria-label', config.title || id);
            if (config.width) input.style.width = config.width;
            if (config.placeholder) input.placeholder = config.placeholder;
            if (config.min !== undefined) input.min = config.min;
            if (config.max !== undefined) input.max = config.max;
            if (config.step !== undefined) input.step = config.step;
            input.value = config.value || '';

            const changeHandler = (e) => {
                if (config.onAction) config.onAction(this.editor, e.target.value);
            };
            input.addEventListener('change', changeHandler);
            this.eventListeners.push({ element: input, event: 'change', handler: changeHandler });

            const mousedownHandler = () => {
                this.editor.selection.saveSelection();
            };
            input.addEventListener('mousedown', mousedownHandler);
            this.eventListeners.push({ element: input, event: 'mousedown', handler: mousedownHandler });

            wrapper.appendChild(input);
            this.element.appendChild(wrapper);
            this.buttonCache.set(id, { wrapper, input });
            return;
        }

        if (config.type === 'range') {
            const wrapper = document.createElement('div');
            wrapper.className = 'editor-toolbar-range-wrapper';
            wrapper.title = config.title;
            wrapper.dataset.id = id;

            const label = document.createElement('span');
            label.className = 'editor-toolbar-range-label';
            label.innerText = config.label || config.icon || '';

            const input = document.createElement('input');
            input.type = 'range';
            input.className = 'editor-toolbar-range';
            input.setAttribute('aria-label', config.title || id);
            if (config.min !== undefined) input.min = config.min;
            if (config.max !== undefined) input.max = config.max;
            if (config.step !== undefined) input.step = config.step;
            input.value = config.value || 0;

            const inputHandler = (e) => {
                if (config.onAction) config.onAction(this.editor, e.target.value);
            };
            input.addEventListener('input', inputHandler);
            this.eventListeners.push({ element: input, event: 'input', handler: inputHandler });

            const mousedownHandler = () => {
                this.editor.selection.saveSelection();
            };
            input.addEventListener('mousedown', mousedownHandler);
            this.eventListeners.push({ element: input, event: 'mousedown', handler: mousedownHandler });

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            this.element.appendChild(wrapper);
            this.buttonCache.set(id, { wrapper, input });
            return;
        }

        // Default button
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'editor-toolbar-btn';
        btn.title = config.title || id;
        btn.innerHTML = config.icon || id;
        btn.dataset.command = id;
        btn.setAttribute('aria-label', config.title || id);

        const clickHandler = () => {
            if (config.onAction) {
                config.onAction(this.editor);
            } else if (config.command) {
                this.editor.execCommand(config.command);
            }
        };
        btn.addEventListener('click', clickHandler);
        this.eventListeners.push({ element: btn, event: 'click', handler: clickHandler });

        this.element.appendChild(btn);
        this.buttonCache.set(id, { btn });
    }

    updateActiveStates() {
        for (const [id, config] of this.registry) {
            const cached = this.buttonCache.get(id);
            if (!cached || !cached.btn) continue;

            const btn = cached.btn;
            let isActive = false;

            try {
                if (config.checkActive) {
                    isActive = config.checkActive(this.editor);
                } else if (config.command) {
                    isActive = document.queryCommandState(config.command);
                }
            } catch (error) {
                // Silently handle queryCommandState errors
            }

            if (isActive) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    }

    render() {
        this.element.innerHTML = '';
        this.buttonCache.clear();
    }

    destroy() {
        // Clear debounce timer
        if (this.updateDebounceTimer) {
            clearTimeout(this.updateDebounceTimer);
        }

        // Remove all event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];

        // Clear caches
        this.registry.clear();
        this.buttonCache.clear();

        // Clear element
        this.element.innerHTML = '';
    }
}
