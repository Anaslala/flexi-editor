import { Icons } from '../ui/Icons';

export class PrintPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Print';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('print', {
            title: 'Print',
            icon: Icons.print,
            command: 'print',
            onAction: (editor) => {
                const content = editor.getData();
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print</title>
                            <style>
                                body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
                                img { max-width: 100%; }
                            </style>
                        </head>
                        <body>
                            ${content}
                            <script>
                                window.onload = function() {
                                    window.print();
                                    window.close();
                                }
                            </script>
                        </body>
                    </html>
                `);
                printWindow.document.close();
            }
        });
    }
}
