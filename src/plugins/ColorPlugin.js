export class ColorPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Color';
    }

    init() {
        if (!this.editor.toolbar) return;

        // Separator before colors
        this.editor.toolbar.registerButton('color-separator', { type: 'separator' });

        // Text Color Input
        this.editor.toolbar.registerButton('foreColor', {
            title: 'Text Color',
            icon: '<span style="color:red; font-weight:bold;">A</span>',
            type: 'color', // New type for color picker
            command: 'foreColor',
            onAction: (editor, value) => {
                editor.execCommand('foreColor', value);
            }
        });

        // Background Color Input
        this.editor.toolbar.registerButton('hiliteColor', {
            title: 'Background Color',
            icon: '<span style="background:yellow; font-weight:bold; padding:0 2px;">A</span>',
            type: 'color',
            command: 'hiliteColor', // 'hiliteColor' is standard for background
            onAction: (editor, value) => {
                editor.execCommand('hiliteColor', value);
            }
        });
    }
}
