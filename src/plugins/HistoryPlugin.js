import { Icons } from '../ui/Icons';

export class HistoryPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'History';
    }

    init() {
        if (!this.editor.toolbar) return;

        // Undo
        this.editor.toolbar.registerButton('undo', {
            title: 'Undo',
            icon: Icons.undo,
            command: 'undo',
            onAction: (editor) => {
                editor.execCommand('undo'); // Uses native execCommand usually, or our CommandManager wrapper
            }
        });

        // Redo
        this.editor.toolbar.registerButton('redo', {
            title: 'Redo',
            icon: Icons.redo,
            command: 'redo',
            onAction: (editor) => {
                editor.execCommand('redo');
            }
        });

        // Add separator after history
        this.editor.toolbar.registerButton('history-separator', { type: 'separator' });
    }
}
