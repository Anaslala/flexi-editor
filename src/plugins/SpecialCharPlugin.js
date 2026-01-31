import { Icons } from '../ui/Icons';
import { Dialog } from '../ui/Dialog';

export class SpecialCharPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'SpecialChar';
        this.chars = [
            '&copy;', '&reg;', '&trade;', '&euro;', '&pound;', '&yen;', '&sect;',
            '&deg;', '&plusmn;', '&para;', '&middot;', '&times;', '&divide;',
            '&alpha;', '&beta;', '&infin;', '&ne;', '&le;', '&ge;', '&larr;',
            '&uarr;', '&rarr;', '&darr;', '&spades;', '&clubs;', '&hearts;', '&diams;'
        ];
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('specialChar', {
            title: 'Insert Special Character',
            icon: Icons.special,
            command: 'insertSpecialChar',
            onAction: (editor) => {
                const dialog = new Dialog(editor);

                const grid = document.createElement('div');
                grid.style.cssText = 'display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; max-height: 300px; overflow-y: auto; padding: 10px;';

                this.chars.forEach(char => {
                    const btn = document.createElement('button');
                    btn.innerHTML = char; // Use innerHTML to render entity
                    btn.style.cssText = 'font-size: 18px; border: 1px solid #eee; background: #fff; cursor: pointer; padding: 8px; border-radius: 4px;';
                    btn.onmouseover = () => btn.style.background = '#f0f0f0';
                    btn.onmouseout = () => btn.style.background = '#fff';
                    btn.onclick = () => {
                        editor.selection.restoreSelection();
                        editor.execCommand('insertHTML', char);
                        dialog.close();
                    };
                    grid.appendChild(btn);
                });

                dialog.show({
                    title: 'Special Characters',
                    content: ''
                });
                dialog.body.innerHTML = '';
                dialog.body.appendChild(grid);
            }
        });
    }
}
