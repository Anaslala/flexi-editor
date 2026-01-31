export class ListPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'List';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('unorderedList', {
            title: 'Bullet List',
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="3" cy="4" r="1.5"/>
                <circle cx="3" cy="8" r="1.5"/>
                <circle cx="3" cy="12" r="1.5"/>
                <rect x="6" y="3" width="9" height="2" rx="1"/>
                <rect x="6" y="7" width="9" height="2" rx="1"/>
                <rect x="6" y="11" width="9" height="2" rx="1"/>
            </svg>`,
            command: 'insertUnorderedList',
            checkActive: () => document.queryCommandState('insertUnorderedList')
        });

        this.editor.toolbar.registerButton('orderedList', {
            title: 'Numbered List',
            icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <text x="1" y="5" font-size="5" font-weight="bold">1</text>
                <text x="1" y="9" font-size="5" font-weight="bold">2</text>
                <text x="1" y="13" font-size="5" font-weight="bold">3</text>
                <rect x="6" y="3" width="9" height="2" rx="1"/>
                <rect x="6" y="7" width="9" height="2" rx="1"/>
                <rect x="6" y="11" width="9" height="2" rx="1"/>
            </svg>`,
            command: 'insertOrderedList',
            checkActive: () => document.queryCommandState('insertOrderedList')
        });
    }
}
