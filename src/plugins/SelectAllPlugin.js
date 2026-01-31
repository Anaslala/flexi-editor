import { Icons } from '../ui/Icons';

export class SelectAllPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'SelectAll';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('selectAll', {
            title: 'Select All',
            icon: Icons.selectAll,
            command: 'selectAll',
            onAction: (editor) => {
                editor.execCommand('selectAll');
            }
        });
    }
}
