import { Icons } from '../ui/Icons';

export class DateTimePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'DateTime';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('insertDate', {
            title: 'Insert Date/Time',
            icon: Icons.date,
            command: 'insertHTML',
            onAction: (editor) => {
                const date = new Date().toLocaleString();
                editor.execCommand('insertHTML', date);
            }
        });
    }
}
