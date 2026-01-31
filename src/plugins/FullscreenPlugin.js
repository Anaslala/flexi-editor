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
            // Simple temp styles
            Object.assign(container.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                background: '#fff',
                borderRadius: 0,
                border: 'none'
            });
            // Adjust content area height
            editor.contentArea.style.height = 'calc(100vh - 50px)'; // Approx toolbar height
        } else {
            container.classList.remove('editor-fullscreen');
            document.body.style.overflow = '';
            // Reset styles
            container.style.position = '';
            container.style.width = '';
            container.style.height = '';
            container.style.zIndex = '';
            container.style.background = '';
            container.style.borderRadius = '';
            container.style.border = '';
            editor.contentArea.style.height = '';
        }
    }
}
