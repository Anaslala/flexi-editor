import { Icons } from '../ui/Icons';
import { Dialog } from '../ui/Dialog';

export class EmojiPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Emoji';
        this.emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('emoji', {
            title: 'Insert Emoji',
            icon: Icons.emoji,
            command: 'insertEmoji',
            onAction: (editor) => {
                const dialog = new Dialog(editor);

                // Construct Grid
                const grid = document.createElement('div');
                grid.style.cssText = 'display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; max-height: 300px; overflow-y: auto; padding: 10px;';

                this.emojis.forEach(char => {
                    const btn = document.createElement('button');
                    btn.textContent = char;
                    btn.style.cssText = 'font-size: 24px; border: 1px solid #eee; background: #fff; cursor: pointer; padding: 5px; border-radius: 4px;';
                    btn.onmouseover = () => btn.style.background = '#f0f0f0';
                    btn.onmouseout = () => btn.style.background = '#fff';
                    btn.onclick = () => {
                        editor.selection.restoreSelection();
                        editor.execCommand('insertText', char);
                        dialog.close();
                    };
                    grid.appendChild(btn);
                });

                dialog.show({
                    title: 'Insert Emoji',
                    content: ''
                    // We append manually to body
                });

                // Inject grid into body
                dialog.body.innerHTML = '';
                dialog.body.appendChild(grid);
            }
        });
    }
}
