import { Icons } from '../ui/Icons';

export class ItalicPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Italic';
    }

    init() {
        if (this.editor.toolbar) {
            this.editor.toolbar.registerButton('italic', {
                title: 'Italic (Ctrl+I)',
                icon: Icons.italic,
                command: 'italic',
                checkActive: () => document.queryCommandState('italic')
            });
        }
    }
}
