import { Icons } from '../ui/Icons';

export class ClearFormatPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'ClearFormat';
    }

    init() {
        if (!this.editor.toolbar) return;

        // Add separator before clear formatting
        this.editor.toolbar.registerButton('format-separator', { type: 'separator' });

        this.editor.toolbar.registerButton('removeFormat', {
            title: 'Clear Formatting',
            icon: '<b>Tx</b>', // Placeholder for now, simple text-x
            command: 'removeFormat'
        });
    }
}
