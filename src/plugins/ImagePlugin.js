import { Icons } from '../ui/Icons';
import { Dialog } from '../ui/Dialog';

export class ImagePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Image';
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.dropHandler = null;
        this.dragoverHandler = null;
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('image', {
            title: 'Insert Image',
            icon: Icons.image,
            command: 'insertImage',
            onAction: (editor) => {
                const dialog = new Dialog(editor);
                dialog.show({
                    title: 'Insert Image',
                    fields: [
                        { name: 'url', label: 'Image URL', placeholder: 'https://...' },
                        { name: 'file', label: 'Or Upload File', type: 'file', accept: 'image/*' },
                        { name: 'alt', label: 'Alt Text', placeholder: 'Image description' }
                    ],
                    onSave: (data) => {
                        if (data.file) {
                            this.insertImageFile(editor, data.file, data.alt);
                        } else if (data.url) {
                            editor.selection.restoreSelection();
                            this.insertImageURL(editor, data.url, data.alt);
                        }
                    }
                });
            }
        });

        // Drag and drop support
        this.dropHandler = (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.insertImageFile(this.editor, file);
            }
        };

        this.dragoverHandler = (e) => e.preventDefault();

        this.editor.contentArea.addEventListener('drop', this.dropHandler);
        this.editor.contentArea.addEventListener('dragover', this.dragoverHandler);
    }

    insertImageURL(editor, url, alt = '') {
        if (!url) return;
        
        const img = document.createElement('img');
        img.src = url;
        if (alt) img.alt = alt;
        img.style.maxWidth = '100%';
        
        editor.selection.restoreSelection();
        const range = editor.selection.getRange();
        if (range) {
            range.deleteContents();
            range.insertNode(img);
            range.collapse(false);
        }
    }

    insertImageFile(editor, file, alt = '') {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Validate file size
        if (file.size > this.maxFileSize) {
            alert(`Image size must be less than ${this.maxFileSize / 1024 / 1024}MB`);
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                this.insertImageURL(editor, e.target.result, alt);
            } catch (error) {
                console.error('Failed to insert image:', error);
                alert('Failed to insert image. Please try again.');
            }
        };

        reader.onerror = () => {
            console.error('Failed to read image file');
            alert('Failed to read image file. Please try again.');
        };

        reader.readAsDataURL(file);
    }

    destroy() {
        if (this.dropHandler) {
            this.editor.contentArea.removeEventListener('drop', this.dropHandler);
        }
        if (this.dragoverHandler) {
            this.editor.contentArea.removeEventListener('dragover', this.dragoverHandler);
        }
    }
}
