import { Icons } from '../ui/Icons';

export class BoldPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Bold';
    }

    init() {
        if (this.editor.toolbar) {
            this.editor.toolbar.registerButton('bold', {
                title: 'Bold (Ctrl+B)',
                icon: Icons.bold,
                command: 'bold',
                checkActive: () => document.queryCommandState('bold')
            });
        }
    }
}
