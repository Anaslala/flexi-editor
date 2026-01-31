export class Dialog {
    constructor(editor) {
        this.editor = editor;
        this.element = null;
        this.overlay = null;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragHandle = null;
    }

    show({ title, content, fields, onSave, onClose, draggable = true, width = '500px', maxWidth = '90vw' }) {
        this.close();

        // Save selection before showing dialog
        this.editor.selection.saveSelection();

        // Create Overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'editor-dialog-overlay';

        // Create Dialog Container
        this.element = document.createElement('div');
        this.element.className = 'editor-dialog';
        this.element.style.width = width;
        this.element.style.maxWidth = maxWidth;
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');

        // Header with drag handle
        const header = document.createElement('div');
        header.className = 'editor-dialog-header';
        this.dragHandle = header;

        const titleEl = document.createElement('h3');
        titleEl.textContent = title;
        titleEl.className = 'editor-dialog-title';
        header.appendChild(titleEl);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'editor-dialog-close';
        closeBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
        closeBtn.onclick = () => this.close();
        closeBtn.setAttribute('aria-label', 'Close dialog');
        header.appendChild(closeBtn);
        
        this.element.appendChild(header);

        // Body
        const body = document.createElement('div');
        this.body = body;
        body.className = 'editor-dialog-body';

        if (content) {
            if (typeof content === 'string') {
                body.innerHTML = content;
            } else {
                body.appendChild(content);
            }
        } else if (fields) {
            fields.forEach(field => {
                const wrapper = document.createElement('div');
                wrapper.className = 'editor-form-group';
                
                if (field.label) {
                    const label = document.createElement('label');
                    label.textContent = field.label;
                    label.htmlFor = `editor-field-${field.name}`;
                    wrapper.appendChild(label);
                }
                
                if (field.type === 'textarea') {
                    const textarea = document.createElement('textarea');
                    textarea.name = field.name;
                    textarea.id = `editor-field-${field.name}`;
                    textarea.rows = field.rows || 4;
                    if (field.value) textarea.value = field.value;
                    if (field.placeholder) textarea.placeholder = field.placeholder;
                    wrapper.appendChild(textarea);
                } else if (field.type === 'select') {
                    const select = document.createElement('select');
                    select.name = field.name;
                    select.id = `editor-field-${field.name}`;
                    field.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.textContent = opt.text;
                        if (opt.value === field.value) option.selected = true;
                        select.appendChild(option);
                    });
                    wrapper.appendChild(select);
                } else {
                    const input = document.createElement('input');
                    input.type = field.type || 'text';
                    input.name = field.name;
                    input.id = `editor-field-${field.name}`;
                    if (field.value) input.value = field.value;
                    if (field.placeholder) input.placeholder = field.placeholder;
                    if (field.accept) input.accept = field.accept;
                    if (field.min !== undefined) input.min = field.min;
                    if (field.max !== undefined) input.max = field.max;
                    wrapper.appendChild(input);
                }
                
                body.appendChild(wrapper);
            });
        }
        this.element.appendChild(body);

        // Footer
        const footer = document.createElement('div');
        footer.className = 'editor-dialog-footer';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'editor-btn editor-btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => this.close();

        const saveBtn = document.createElement('button');
        saveBtn.className = 'editor-btn editor-btn-primary';
        saveBtn.textContent = 'Insert';
        saveBtn.onclick = () => {
            const data = {};
            if (fields) {
                body.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.type === 'file') {
                        data[input.name] = input.files[0];
                    } else {
                        data[input.name] = input.value;
                    }
                });
            }
            if (onSave) onSave(data, body);
            this.close();
        };

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);
        this.element.appendChild(footer);

        // Mount
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.element);

        // Setup dragging
        if (draggable) {
            this.setupDrag();
        }

        // Focus first input
        setTimeout(() => {
            const firstInput = body.querySelector('input:not([type="file"]), select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);

        // Close on overlay click
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) this.close();
        };

        // ESC key to close
        this.handleKeyDown = (e) => {
            if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this.handleKeyDown);

        if (onClose) this.onCloseCallback = onClose;

        // Animate in
        requestAnimationFrame(() => {
            this.overlay.classList.add('editor-dialog-overlay-visible');
            this.element.classList.add('editor-dialog-visible');
        });
    }

    setupDrag() {
        if (!this.dragHandle) return;

        this.dragHandle.style.cursor = 'move';

        const onMouseDown = (e) => {
            // Ignore if clicking close button or other interactive elements
            if (e.target.closest('button, input, select, textarea')) return;

            this.isDragging = true;
            
            const rect = this.element.getBoundingClientRect();
            this.offsetX = e.clientX - rect.left;
            this.offsetY = e.clientY - rect.top;

            // Remove centering transform
            this.element.style.transform = 'none';
            this.element.style.left = `${rect.left}px`;
            this.element.style.top = `${rect.top}px`;

            document.addEventListener('mousemove', this.onDrag);
            document.addEventListener('mouseup', this.onStopDrag);

            document.body.style.userSelect = 'none';
            this.dragHandle.style.cursor = 'grabbing';
            
            e.preventDefault();
        };

        this.dragHandle.addEventListener('mousedown', onMouseDown);
    }

    onDrag = (e) => {
        if (!this.isDragging) return;

        let x = e.clientX - this.offsetX;
        let y = e.clientY - this.offsetY;

        // Constrain to viewport
        const rect = this.element.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    onStopDrag = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.onStopDrag);
        document.body.style.userSelect = '';
        if (this.dragHandle) this.dragHandle.style.cursor = 'move';
    }

    close() {
        // Animate out
        if (this.element) {
            this.element.classList.remove('editor-dialog-visible');
            if (this.overlay) this.overlay.classList.remove('editor-dialog-overlay-visible');
            
            setTimeout(() => {
                if (this.element) {
                    this.element.remove();
                    this.element = null;
                }
                if (this.overlay) {
                    this.overlay.remove();
                    this.overlay = null;
                }
            }, 200);
        }

        // Cleanup
        if (this.handleKeyDown) {
            document.removeEventListener('keydown', this.handleKeyDown);
            this.handleKeyDown = null;
        }
        
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.onStopDrag);
        
        // Restore selection
        this.editor.selection.restoreSelection();
        this.editor.contentArea.focus();
        
        if (this.onCloseCallback) {
            this.onCloseCallback();
            this.onCloseCallback = null;
        }
    }
}
