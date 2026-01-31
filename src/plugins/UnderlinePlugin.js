import { Icons } from '../ui/Icons';

export class UnderlinePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Underline';
    }

    init() {
        if (this.editor.toolbar) {
            this.editor.toolbar.registerButton('underline', {
                title: 'Underline (Ctrl+U)',
                icon: Icons.underline,
                command: 'underline',
                checkActive: () => document.queryCommandState('underline')
            });
        }
    }
}
