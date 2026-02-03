/**
 * ImageUploadPlugin
 * 
 * Enhances the existing ImagePlugin with file upload and drag-drop capabilities.
 * 
 * Features:
 * - File picker upload
 * - Drag and drop support
 * - Upload progress indicator
 * - Custom upload adapter interface
 * - Error handling with user feedback
 * 
 * Configuration:
 * {
 *   imageUpload: {
 *     enabled: true,
 *     maxSize: 5 * 1024 * 1024,  // 5MB
 *     allowedTypes: ['image/jpeg', 'image/png', ...],
 *     adapter: async (file) => { return { url: '...' }; }
 *   }
 * }
 */

import { Icons } from '../ui/Icons';

export class ImageUploadPlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'ImageUpload';

        // Merge configuration
        this.options = {
            enabled: true,
            maxSize: 5 * 1024 * 1024, // 5MB
            allowedTypes: [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/svg+xml'
            ],
            adapter: this.defaultAdapter.bind(this),
            ...editor.config.imageUpload,
            ...options
        };

        this.dropHandler = null;
        this.dragoverHandler = null;
        this.dragleaveHandler = null;
        this.uploadOverlay = null;
        this.imagePlugin = null;
    }

    /**
     * Initialize the plugin
     */
    init() {
        if (!this.options.enabled) {
            return;
        }

        // Get reference to existing ImagePlugin
        this.imagePlugin = this.editor.plugins.get('Image');

        if (!this.imagePlugin) {
            console.warn('ImageUploadPlugin: ImagePlugin not found. Upload features will not work.');
            return;
        }

        // Enhance image button to include upload option
        this.enhanceImageButton();

        // Setup drag and drop
        this.setupDragDrop();
    }

    /**
     * Default upload adapter (base64 encoding)
     */
    async defaultAdapter(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve({ url: reader.result });
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Enhance image button to include upload option
     */
    enhanceImageButton() {
        if (!this.editor.toolbar) return;

        // Store original image button action
        const imageButton = this.editor.toolbar.buttons?.get?.('image');

        if (!imageButton) return;

        const originalAction = imageButton.onAction;

        // Replace with enhanced action
        imageButton.onAction = (editor) => {
            this.showEnhancedImageDialog();
        };
    }

    /**
     * Show enhanced image dialog with upload option
     */
    showEnhancedImageDialog() {
        const overlay = document.createElement('div');
        overlay.className = 'image-dialog-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.className = 'image-dialog';
        dialog.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            width: 500px;
            max-width: 90vw;
            overflow: hidden;
        `;

        dialog.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb;">
                <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #1f2937;">Insert Image</h3>
            </div>
            <div style="padding: 20px;">
                <div class="image-tabs" style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
                    <button class="tab-btn active" data-tab="url" style="padding: 8px 16px; border: none; background: none; cursor: pointer; border-bottom: 2px solid #1b9af7; color: #1b9af7; font-weight: 600;">From URL</button>
                    <button class="tab-btn" data-tab="upload" style="padding: 8px 16px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; color: #666; font-weight: 600;">Upload File</button>
                </div>
                
                <div class="tab-content" data-tab="url">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Image URL</label>
                        <input type="text" id="image-url" placeholder="https://example.com/image.jpg" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Alt Text</label>
                        <input type="text" id="image-alt-url" placeholder="Image description" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                </div>
                
                <div class="tab-content" data-tab="upload" style="display: none;">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Choose File</label>
                        <input type="file" id="image-file" accept="image/*" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                        <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">Max size: ${this.formatFileSize(this.options.maxSize)}</div>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Alt Text</label>
                        <input type="text" id="image-alt-file" placeholder="Image description" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px;">
                    <button class="cancel-btn" style="padding: 8px 16px; border: 1px solid #d1d5db; background: white; border-radius: 6px; cursor: pointer; font-weight: 600; color: #374151;">Cancel</button>
                    <button class="insert-btn" style="padding: 8px 16px; border: none; background: #1b9af7; color: white; border-radius: 6px; cursor: pointer; font-weight: 600;">Insert Image</button>
                </div>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Tab switching
        const tabBtns = dialog.querySelectorAll('.tab-btn');
        const tabContents = dialog.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;

                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.borderBottomColor = 'transparent';
                    b.style.color = '#666';
                });

                btn.classList.add('active');
                btn.style.borderBottomColor = '#1b9af7';
                btn.style.color = '#1b9af7';

                tabContents.forEach(content => {
                    content.style.display = content.dataset.tab === tab ? 'block' : 'none';
                });
            });
        });

        // Cancel button
        dialog.querySelector('.cancel-btn').addEventListener('click', () => {
            overlay.remove();
        });

        // Insert button
        dialog.querySelector('.insert-btn').addEventListener('click', async () => {
            const activeTab = dialog.querySelector('.tab-btn.active').dataset.tab;

            if (activeTab === 'url') {
                const url = dialog.querySelector('#image-url').value;
                const alt = dialog.querySelector('#image-alt-url').value;

                if (url) {
                    this.imagePlugin.insertImageURL(this.editor, url, alt);
                    overlay.remove();
                }
            } else {
                const fileInput = dialog.querySelector('#image-file');
                const file = fileInput.files[0];
                const alt = dialog.querySelector('#image-alt-file').value;

                if (file) {
                    overlay.remove();
                    await this.handleFileUpload(file, alt);
                }
            }
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    /**
     * Setup drag and drop
     */
    setupDragDrop() {
        // Prevent default drag behaviors on document and editor
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        // Add listeners to both document and contentArea to ensure no duplicate handling
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.editor.contentArea.addEventListener(eventName, preventDefaults, true);
        });

        this.dropHandler = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hideDropZone();

            // Prevent any further propagation to avoid browser default behavior
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files);
                const imageFiles = files.filter(f => f.type.startsWith('image/'));

                if (imageFiles.length === 0) return;

                // Process ONLY the first image to avoid duplicates
                const file = imageFiles[0];

                // Use a flag to prevent duplicate processing
                if (this._isProcessingDrop) {
                    return;
                }

                this._isProcessingDrop = true;

                try {
                    await this.handleFileUpload(file);
                } finally {
                    // Reset flag after small delay
                    setTimeout(() => {
                        this._isProcessingDrop = false;
                    }, 100);
                }
            }

            // Block any default browser handling
            return false;
        };

        this.dragoverHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            this.showDropZone();
        };

        this.dragleaveHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only hide if leaving the content area entirely
            if (!this.editor.contentArea.contains(e.relatedTarget)) {
                this.hideDropZone();
            }
        };

        // Use capture phase to intercept events before any bubbling
        this.editor.contentArea.addEventListener('drop', this.dropHandler, true);
        this.editor.contentArea.addEventListener('dragover', this.dragoverHandler, true);
        this.editor.contentArea.addEventListener('dragleave', this.dragleaveHandler, true);
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(file, alt = '') {
        try {
            // Validate file
            this.validateFile(file);

            // Show upload progress
            this.showUploadProgress();

            // Upload using adapter
            const result = await this.options.adapter(file);

            // Hide upload progress
            this.hideUploadProgress();

            // Insert image
            if (result && result.url) {
                this.imagePlugin.insertImageURL(this.editor, result.url, alt);
            } else {
                throw new Error('Upload adapter did not return a URL');
            }

        } catch (error) {
            this.hideUploadProgress();
            this.handleUploadError(error);
        }
    }

    /**
     * Validate file
     */
    validateFile(file) {
        // Check type
        if (!this.options.allowedTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed types: ${this.options.allowedTypes.join(', ')}`);
        }

        // Check size
        if (file.size > this.options.maxSize) {
            const maxMB = this.formatFileSize(this.options.maxSize);
            throw new Error(`File size exceeds ${maxMB} limit`);
        }
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    /**
     * Show upload progress
     */
    showUploadProgress() {
        const overlay = document.createElement('div');
        overlay.className = 'image-upload-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.9);
            z-index: 10001;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        overlay.innerHTML = `
            <div class="upload-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1b9af7; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div class="upload-message" style="margin-top: 16px; color: #666; font-size: 14px;">Uploading image...</div>
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        overlay.appendChild(style);

        document.body.appendChild(overlay);
        this.uploadOverlay = overlay;
    }

    /**
     * Hide upload progress
     */
    hideUploadProgress() {
        if (this.uploadOverlay) {
            this.uploadOverlay.remove();
            this.uploadOverlay = null;
        }
    }

    /**
     * Show drop zone indicator
     */
    showDropZone() {
        if (this.dropZoneIndicator) return;

        this.editor.contentArea.classList.add('drag-over');

        const indicator = document.createElement('div');
        indicator.className = 'drop-zone-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px dashed #1b9af7;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            pointer-events: none;
            z-index: 1000;
        `;

        indicator.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 16px;">📁</div>
            <div style="color: #1b9af7; font-weight: 600;">Drop image here</div>
        `;

        this.editor.element.style.position = 'relative';
        this.editor.element.appendChild(indicator);
        this.dropZoneIndicator = indicator;
    }

    /**
     * Hide drop zone indicator
     */
    hideDropZone() {
        this.editor.contentArea.classList.remove('drag-over');

        if (this.dropZoneIndicator) {
            this.dropZoneIndicator.remove();
            this.dropZoneIndicator = null;
        }
    }

    /**
     * Handle upload error
     */
    handleUploadError(error) {
        console.error('ImageUpload: Upload failed:', error);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'image-upload-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            padding: 16px;
            max-width: 300px;
            z-index: 10002;
            animation: slideIn 0.3s ease;
        `;

        errorDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
            <div style="color: #721c24; margin-bottom: 12px; font-size: 14px;">${error.message}</div>
            <button class="error-dismiss" style="background: #721c24; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;">Dismiss</button>
        `;

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        errorDiv.appendChild(style);

        document.body.appendChild(errorDiv);

        // Auto-dismiss after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);

        // Manual dismiss
        errorDiv.querySelector('.error-dismiss').addEventListener('click', () => {
            errorDiv.remove();
        });
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove event listeners with capture:true option
        if (this.dropHandler) {
            this.editor.contentArea.removeEventListener('drop', this.dropHandler, true);
        }
        if (this.dragoverHandler) {
            this.editor.contentArea.removeEventListener('dragover', this.dragoverHandler, true);
        }
        if (this.dragleaveHandler) {
            this.editor.contentArea.removeEventListener('dragleave', this.dragleaveHandler, true);
        }

        // Remove preventDefaults listeners
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.editor.contentArea.removeEventListener(eventName, preventDefaults, true);
        });

        this.hideUploadProgress();
        this.hideDropZone();

        this.dropHandler = null;
        this.dragoverHandler = null;
        this.dragleaveHandler = null;
        this._isProcessingDrop = false;
    }
}
