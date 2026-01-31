export class ListPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'List';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('unorderedList', {
            title: 'Bullet List',
            icon: '<span>•</span>', // UTF-8 bullet
            command: 'insertUnorderedList',
            checkActive: () => document.queryCommandState('insertUnorderedList')
        });

        this.editor.toolbar.registerButton('orderedList', {
            title: 'Numbered List',
            icon: '<span>1.</span>',
            command: 'insertOrderedList',
            checkActive: () => document.queryCommandState('insertOrderedList')
        });
    }
}
