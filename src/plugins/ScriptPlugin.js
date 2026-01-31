import { Icons } from '../ui/Icons';

export class ScriptPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Script';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('subscript', {
            title: 'Subscript',
            icon: Icons.subscript,
            command: 'subscript',
            checkActive: () => document.queryCommandState('subscript')
        });

        this.editor.toolbar.registerButton('superscript', {
            title: 'Superscript',
            icon: Icons.superscript,
            command: 'superscript',
            checkActive: () => document.queryCommandState('superscript')
        });
    }
}
