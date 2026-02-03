import { Icons } from '../ui/Icons';

export class FullscreenPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Fullscreen';
        this.isFullscreen = false;
    }

    init() {
        if (!this.editor.toolbar) return;

        // Separator
        this.editor.toolbar.registerButton('screen-separator', { type: 'separator' });

        this.editor.toolbar.registerButton('fullscreen', {
            title: 'Toggle Fullscreen',
            icon: Icons.fullscreen,
            command: 'fullscreen',
            onAction: (editor) => this.toggleFullscreen(editor),
            checkActive: () => this.isFullscreen
        });
    }

    toggleFullscreen(editor) {
        this.isFullscreen = !this.isFullscreen;
        const container = editor.element;

        if (this.isFullscreen) {
            container.classList.add('editor-fullscreen');
            document.body.style.overflow = 'hidden';
            
            // Apply fullscreen styles
            Object.assign(container.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                background: '#fff',
                borderRadius: 0,
                border: 'none',
                display: 'flex',
                flexDirection: 'column'
            });
            
            // Get toolbar element
            const toolbar = editor.toolbar?.element;
            
            // Allow toolbar to wrap vertically
            if (toolbar) {
                toolbar.style.flexWrap = 'wrap';
                toolbar.style.flexShrink = '0';
                toolbar.style.overflowX = 'visible';
                toolbar.style.overflowY = 'visible';
            }
            
            // Make content area flexible
            editor.contentArea.style.flex = '1';
            editor.contentArea.style.height = 'auto';
            editor.contentArea.style.maxHeight = 'none';
            editor.contentArea.style.overflow = 'auto';
            
        } else {
            container.classList.remove('editor-fullscreen');
            document.body.style.overflow = '';
            
            // Reset container styles
            container.style.position = '';
            container.style.top = '';
            container.style.left = '';
            container.style.width = '';
            container.style.height = '';
            container.style.zIndex = '';
            container.style.background = '';
            container.style.borderRadius = '';
            container.style.border = '';
            container.style.display = '';
            container.style.flexDirection = '';
            
            // Reset toolbar styles
            const toolbar = editor.toolbar?.element;
            if (toolbar) {
                toolbar.style.flexWrap = '';
                toolbar.style.flexShrink = '';
                toolbar.style.overflowX = '';
                toolbar.style.overflowY = '';
            }
            
            // Reset content area
            editor.contentArea.style.flex = '';
            editor.contentArea.style.height = '';
            editor.contentArea.style.maxHeight = '';
            editor.contentArea.style.overflow = '';
        }
    }
}
