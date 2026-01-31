import { Icons } from '../ui/Icons';

export class AlignmentPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Alignment';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('align-separator', { type: 'separator' });

        const aligns = [
            { id: 'justifyLeft', icon: Icons.alignLeft, title: 'Align Left' },
            { id: 'justifyCenter', icon: Icons.alignCenter, title: 'Align Center' },
            { id: 'justifyRight', icon: Icons.alignRight, title: 'Align Right' },
            { id: 'justifyFull', icon: Icons.justify, title: 'Justify' }
        ];

        aligns.forEach(align => {
            this.editor.toolbar.registerButton(align.id, {
                title: align.title,
                icon: align.icon,
                command: align.id,
                checkActive: () => document.queryCommandState(align.id)
            });
        });

        this.editor.toolbar.registerButton('indent-separator', { type: 'separator' });

        this.editor.toolbar.registerButton('indent', {
            title: 'Indent',
            icon: Icons.indent,
            command: 'indent'
        });

        this.editor.toolbar.registerButton('outdent', {
            title: 'Outdent',
            icon: Icons.outdent,
            command: 'outdent'
        });
    }
}
