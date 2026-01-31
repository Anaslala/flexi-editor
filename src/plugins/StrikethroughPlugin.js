import { Icons } from '../ui/Icons';

export class StrikethroughPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Strikethrough';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('strikethrough', {
            title: 'Strikethrough',
            icon: Icons.strikethrough,
            command: 'strikeThrough',
            checkActive: () => document.queryCommandState('strikeThrough')
        });
    }
}
