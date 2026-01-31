import { Dialog } from '../ui/Dialog';
import { Icons } from '../ui/Icons'; // Fix import if previously missing or implicit? Assuming Icons import was meant to be there

export class TablePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Table';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('table', {
            title: 'Insert Table',
            icon: Icons.table || '<b>tbl</b>', // Fallback if icon missing
            command: 'insertTable',
            onAction: (editor) => {
                const dialog = new Dialog(editor);
                dialog.show({
                    title: 'Insert Table',
                    fields: [
                        { name: 'rows', label: 'Rows', type: 'number', value: 2 },
                        { name: 'cols', label: 'Columns', type: 'number', value: 2 }
                    ],
                    onSave: (data) => {
                        if (data.rows && data.cols) {
                            editor.selection.restoreSelection();
                            this.insertTable(data.rows, data.cols);
                        }
                    }
                });
            }
        });
    }

    insertTable(rows, cols) {
        let html = '<table border="1" style="width:100%; border-collapse: collapse;"><tbody>';
        for (let i = 0; i < rows; i++) {
            html += '<tr>';
            for (let j = 0; j < cols; j++) {
                html += '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table><p><br/></p>'; // Extra p to exit table
        this.editor.execCommand('insertHTML', html);
    }
}
