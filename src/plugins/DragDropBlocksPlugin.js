/**
 * DragDropBlocksPlugin
 * 
 * Enables drag and drop reordering of content blocks.
 * Shows drag handles on hover for easy block manipulation.
 * 
 * Features:
 * - Drag handles on hover
 * - Visual drop zone indicators
 * - Smooth animations
 * - Touch support
 * 
 * Configuration:
 * {
 *   dragDropBlocks: {
 *     enabled: true,
 *     handle: 'hover',
 *     animation: true
 *   }
 * }
 */

export class DragDropBlocksPlugin {
    constructor(editor, options = {}) {
        this.editor = editor;
        this.name = 'DragDropBlocks';
        
        // Merge configuration
        this.options = {
            enabled: true,
            handle: 'hover', // 'hover' | 'always' | 'never'
            animation: true,
            ...editor.config.dragDropBlocks,
            ...options
        };
        
        this.draggedElement = null;
        this.dropIndicator = null;
        this.handles = new Map();
    }
    
    /**
     * Initialize the plugin
     */
    init() {
        if (!this.options.enabled) {
            return;
        }
        
        // Create drop indicator
        this.createDropIndicator();
        
        // Add drag handles to blocks
        this.addDragHandles();
        
        // Watch for new blocks
        const observer = new MutationObserver(() => {
            this.addDragHandles();
        });
        
        observer.observe(this.editor.contentArea, {
            childList: true,
            subtree: true
        });
        
        this.observer = observer;
    }
    
    /**
     * Create drop indicator
     */
    createDropIndicator() {
        this.dropIndicator = document.createElement('div');
        this.dropIndicator.className = 'drop-indicator';
        this.dropIndicator.style.cssText = `
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: #1b9af7;
            border-radius: 2px;
            display: none;
            z-index: 9998;
            transition: top 0.15s ease;
            box-shadow: 0 0 8px rgba(27, 154, 247, 0.5);
        `;
        
        this.editor.element.style.position = 'relative';
        this.editor.element.appendChild(this.dropIndicator);
    }
    
    /**
     * Add drag handles to blocks
     */
    addDragHandles() {
        const blocks = this.editor.contentArea.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table, img');
        
        blocks.forEach(block => {
            // Skip if already has handle
            if (this.handles.has(block)) return;
            
            // Skip if inside list
            if (block.tagName === 'LI') return;
            
            // Create handle
            const handle = this.createHandle(block);
            this.handles.set(block, handle);
        });
    }
    
    /**
     * Create drag handle for block
     */
    createHandle(block) {
        const handle = document.createElement('div');
        handle.className = 'drag-handle';
        handle.contentEditable = 'false';
        handle.draggable = true;
        handle.innerHTML = '⋮⋮';
        handle.style.cssText = `
            position: absolute;
            left: -30px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            color: #d1d5db;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.15s ease, color 0.15s ease;
            user-select: none;
        `;
        
        // Position block relatively
        if (getComputedStyle(block).position === 'static') {
            block.style.position = 'relative';
        }
        
        block.appendChild(handle);
        
        // Show handle on hover
        if (this.options.handle === 'hover') {
            block.addEventListener('mouseenter', () => {
                handle.style.opacity = '1';
            });
            
            block.addEventListener('mouseleave', () => {
                if (!this.draggedElement) {
                    handle.style.opacity = '0';
                }
            });
        } else if (this.options.handle === 'always') {
            handle.style.opacity = '1';
        }
        
        // Drag events
        handle.addEventListener('dragstart', (e) => {
            this.handleDragStart(e, block);
        });
        
        handle.addEventListener('dragend', (e) => {
            this.handleDragEnd(e);
        });
        
        // Hover effect
        handle.addEventListener('mouseenter', () => {
            handle.style.color = '#6b7280';
        });
        
        handle.addEventListener('mouseleave', () => {
            handle.style.color = '#d1d5db';
        });
        
        return handle;
    }
    
    /**
     * Handle drag start
     */
    handleDragStart(e, block) {
        this.draggedElement = block;
        
        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', block.outerHTML);
        
        // Style dragged element
        setTimeout(() => {
            block.style.opacity = '0.4';
        }, 0);
        
        // Change cursor
        document.body.style.cursor = 'grabbing';
        
        // Add drag over listeners to all blocks
        const blocks = this.editor.contentArea.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table, img');
        
        blocks.forEach(b => {
            if (b === block) return;
            
            b.addEventListener('dragover', this.handleDragOver.bind(this));
            b.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }
    
    /**
     * Handle drag over
     */
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const block = e.currentTarget;
        const rect = block.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        // Determine drop position
        const dropBefore = e.clientY < midpoint;
        
        // Show drop indicator
        this.showDropIndicator(block, dropBefore);
        
        // Store drop target
        this.dropTarget = block;
        this.dropBefore = dropBefore;
    }
    
    /**
     * Handle drag leave
     */
    handleDragLeave(e) {
        // Hide indicator if leaving to non-block element
        if (!e.relatedTarget || !this.editor.contentArea.contains(e.relatedTarget)) {
            this.hideDropIndicator();
        }
    }
    
    /**
     * Handle drag end
     */
    handleDragEnd(e) {
        if (!this.draggedElement) return;
        
        // Restore opacity
        this.draggedElement.style.opacity = '1';
        
        // Restore cursor
        document.body.style.cursor = '';
        
        // Perform drop if target exists
        if (this.dropTarget && this.draggedElement !== this.dropTarget) {
            this.performDrop();
        }
        
        // Hide indicator
        this.hideDropIndicator();
        
        // Remove drag over listeners
        const blocks = this.editor.contentArea.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table, img');
        blocks.forEach(b => {
            b.removeEventListener('dragover', this.handleDragOver);
            b.removeEventListener('dragleave', this.handleDragLeave);
        });
        
        // Clear state
        this.draggedElement = null;
        this.dropTarget = null;
        this.dropBefore = false;
    }
    
    /**
     * Show drop indicator
     */
    showDropIndicator(block, before) {
        if (!this.dropIndicator) return;
        
        const rect = block.getBoundingClientRect();
        const containerRect = this.editor.element.getBoundingClientRect();
        
        const top = before 
            ? rect.top - containerRect.top - 2
            : rect.bottom - containerRect.top - 2;
        
        this.dropIndicator.style.top = `${top}px`;
        this.dropIndicator.style.display = 'block';
    }
    
    /**
     * Hide drop indicator
     */
    hideDropIndicator() {
        if (this.dropIndicator) {
            this.dropIndicator.style.display = 'none';
        }
    }
    
    /**
     * Perform drop operation
     */
    performDrop() {
        if (!this.draggedElement || !this.dropTarget) return;
        
        // Animate if enabled
        if (this.options.animation) {
            this.draggedElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        }
        
        // Move element
        if (this.dropBefore) {
            this.dropTarget.parentNode.insertBefore(this.draggedElement, this.dropTarget);
        } else {
            this.dropTarget.parentNode.insertBefore(this.draggedElement, this.dropTarget.nextSibling);
        }
        
        // Trigger change event
        this.editor.trigger('change');
        
        // Remove transition after animation
        if (this.options.animation) {
            setTimeout(() => {
                if (this.draggedElement) {
                    this.draggedElement.style.transition = '';
                }
            }, 300);
        }
    }
    
    /**
     * Cleanup and destroy
     */
    destroy() {
        // Remove observer
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remove handles
        this.handles.forEach((handle, block) => {
            if (handle.parentNode) {
                handle.remove();
            }
        });
        this.handles.clear();
        
        // Remove drop indicator
        if (this.dropIndicator && this.dropIndicator.parentNode) {
            this.dropIndicator.remove();
        }
        
        this.draggedElement = null;
        this.dropIndicator = null;
        this.observer = null;
    }
}
