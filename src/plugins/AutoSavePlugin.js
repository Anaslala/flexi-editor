/**
 * AutoSavePlugin
 * 
 * Automatically saves editor content using a custom adapter.
 * Users must provide their own save/load adapters to integrate with their backend/database.
 * 
 * Features:
 * - Debounced auto-save on content change
 * - Draft recovery prompt on initialization
 * - Configurable save interval
 * - Custom save/load adapters
 * 
 * Configuration:
 * {
 *   autoSave: {
 *     enabled: true,
 *     interval: 2000,
 *     saveAdapter: async (content) => { },
 *     loadAdapter: async () => { return { content, timestamp } },
 *     clearAdapter: async () => { }
 *   }
 * }
 */

export class AutoSavePlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'AutoSave';
        
        // Merge configuration
        this.options = {
            enabled: true,
            interval: 2000,
            saveAdapter: null,      // User must provide
            loadAdapter: null,      // User must provide
            clearAdapter: null,     // User must provide
            ...editor.config.autoSave,
            ...options
        };
        
        this.saveTimeout = null;
        this.changeHandler = null;
        this.editorId = this.generateEditorId();
    }
    
    /**
     * Initialize the plugin
     */
    init() {
        if (!this.options.enabled) {
            return;
        }
        
        // Check if adapters are provided
        if (!this.options.saveAdapter || !this.options.loadAdapter) {
            console.warn('AutoSave: saveAdapter and loadAdapter are required. Plugin will not work without them.');
            return;
        }
        
        // Check for existing draft
        this.checkForDraft();
        
        // Start auto-save
        this.startAutoSave();
    }
    
    /**
     * Generate unique editor ID
     */
    generateEditorId() {
        // Use element ID if available, otherwise generate random ID
        if (this.editor.element.id) {
            return this.editor.element.id;
        }
        return `editor-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Check for existing draft and show recovery prompt
     */
    async checkForDraft() {
        try {
            const draft = await this.options.loadAdapter();
            
            if (draft && draft.content && draft.content.trim() !== '') {
                this.showRecoveryPrompt(draft);
            }
        } catch (error) {
            console.error('AutoSave: Failed to check for draft:', error);
        }
    }
    
    /**
     * Show draft recovery prompt
     */
    showRecoveryPrompt(draft) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'draft-recovery-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;
        
        // Create popup
        const popup = document.createElement('div');
        popup.className = 'draft-recovery-popup';
        popup.style.cssText = `
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 480px;
            max-width: 90vw;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        `;
        
        popup.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px; animation: bounce 0.6s ease;">💾</div>
                <h2 style="margin: 0; color: white; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Draft Found!</h2>
                <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">We saved your work from ${this.formatTimestamp(draft.timestamp)}</p>
            </div>
            
            <div style="padding: 32px 24px;">
                <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 15px; line-height: 1.6; text-align: center;">
                    Would you like to restore your previous content or start fresh?
                </p>
                
                <div style="display: flex; gap: 12px;">
                    <button class="draft-restore" style="
                        flex: 1;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 14px 24px;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    ">
                        <span style="font-size: 18px; margin-right: 8px;">✨</span>
                        Restore Draft
                    </button>
                    
                    <button class="draft-discard" style="
                        flex: 1;
                        background: white;
                        color: #6b7280;
                        border: 2px solid #e5e7eb;
                        padding: 14px 24px;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">
                        <span style="font-size: 18px; margin-right: 8px;">🗑️</span>
                        Start Fresh
                    </button>
                </div>
                
                <p style="margin: 20px 0 0 0; text-align: center; font-size: 12px; color: #9ca3af;">
                    Your draft is automatically saved every few seconds
                </p>
            </div>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(30px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .draft-restore:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
            }
            
            .draft-discard:hover {
                background: #f9fafb !important;
                border-color: #d1d5db !important;
                transform: translateY(-2px);
            }
            
            .draft-restore:active,
            .draft-discard:active {
                transform: translateY(0);
            }
        `;
        overlay.appendChild(style);
        
        // Handle restore
        popup.querySelector('.draft-restore').addEventListener('click', () => {
            this.restoreDraft(draft);
            overlay.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => overlay.remove(), 200);
        });
        
        // Handle discard
        popup.querySelector('.draft-discard').addEventListener('click', () => {
            this.clearDraft();
            overlay.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => overlay.remove(), 200);
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.clearDraft();
                overlay.style.animation = 'fadeOut 0.2s ease';
                setTimeout(() => overlay.remove(), 200);
            }
        });
        
        // Add fadeOut animation
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        overlay.appendChild(fadeOutStyle);
        
        // Store reference for cleanup
        this.recoveryBanner = overlay;
    }
    
    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    }
    
    /**
     * Restore draft content
     */
    restoreDraft(draft) {
        try {
            this.editor.setData(draft.content);
            console.log('AutoSave: Draft restored successfully');
        } catch (error) {
            console.error('AutoSave: Failed to restore draft:', error);
        }
    }
    
    /**
     * Clear draft using clearAdapter
     */
    async clearDraft() {
        try {
            if (this.options.clearAdapter) {
                await this.options.clearAdapter();
            }
            console.log('AutoSave: Draft cleared');
        } catch (error) {
            console.error('AutoSave: Failed to clear draft:', error);
        }
    }
    
    /**
     * Start auto-save on content change
     */
    startAutoSave() {
        this.changeHandler = () => {
            this.debouncedSave();
        };
        
        this.editor.on('change', this.changeHandler);
    }
    
    /**
     * Stop auto-save
     */
    stopAutoSave() {
        if (this.changeHandler) {
            this.editor.off('change', this.changeHandler);
            this.changeHandler = null;
        }
        
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }
    }
    
    /**
     * Debounced save function
     */
    debouncedSave() {
        // Clear existing timeout
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        
        // Set new timeout
        this.saveTimeout = setTimeout(() => {
            this.saveContent();
        }, this.options.interval);
    }
    
    /**
     * Save content using saveAdapter
     */
    async saveContent() {
        try {
            const content = this.editor.getData();
            
            // Don't save empty content
            if (!content || content.trim() === '') {
                return;
            }
            
            const draftData = {
                content: content,
                timestamp: Date.now(),
                editorId: this.editorId
            };
            
            // Call user's save adapter
            if (this.options.saveAdapter) {
                await this.options.saveAdapter(draftData);
            }
            
            // Trigger save event
            this.editor.trigger('autosave', draftData);
            
        } catch (error) {
            console.error('AutoSave: Failed to save content:', error);
        }
    }
    
    /**
     * Manually trigger save
     */
    async save() {
        await this.saveContent();
    }
    
    /**
     * Load draft content using loadAdapter
     */
    async loadDraft() {
        try {
            if (this.options.loadAdapter) {
                return await this.options.loadAdapter();
            }
            return null;
        } catch (error) {
            console.error('AutoSave: Failed to load draft:', error);
            return null;
        }
    }
    
    /**
     * Cleanup and destroy
     */
    destroy() {
        // Stop auto-save
        this.stopAutoSave();
        
        // Remove recovery banner if exists
        if (this.recoveryBanner && this.recoveryBanner.parentNode) {
            this.recoveryBanner.remove();
        }
        
        // Clear references
        this.recoveryBanner = null;
    }
}
