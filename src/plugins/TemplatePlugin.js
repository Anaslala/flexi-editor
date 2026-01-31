import { Icons } from '../ui/Icons';
import { Dialog } from '../ui/Dialog';

export class TemplatePlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Template';
        this.templates = [
            {
                name: 'Newsletter',
                html: `<div style="padding: 20px; background: #f9f9f9; border: 1px solid #ddd;">
                    <h1 style="color: #333; text-align: center;">Weekly Newsletter</h1>
                    <p style="text-align: center; color: #777;">Issue #1 • January 2026</p>
                    <hr>
                    <h3>Top Stories</h3>
                    <p>Write your first story here. Engagement is key!</p>
                    <div style="background: #fff; padding: 15px; margin: 15px 0; border: 1px solid #eee;">
                        <h4>Highlighted Feature</h4>
                        <p>Call out something important in this box.</p>
                    </div>
                </div>`
            },
            {
                name: 'Product Card',
                html: `<div style="border: 1px solid #e1e4e8; border-radius: 8px; overflow: hidden; max-width: 300px; font-family: sans-serif;">
                    <div style="height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #999;">Image Placeholder</div>
                    <div style="padding: 16px;">
                        <h3 style="margin: 0 0 8px 0;">Product Name</h3>
                        <p style="margin: 0 0 16px 0; color: #586069;">Great product description goes here.</p>
                        <button style="width: 100%; padding: 8px; background: #0366d6; color: white; border: none; border-radius: 4px;">Buy Now</button>
                    </div>
                </div>`
            },
            {
                name: 'Blog Post',
                html: `<h1>The Art of Writing</h1>
                    <p><em>By Author Name</em></p>
                    <p>Introduction paragraph. Hook the reader immediately.</p>
                    <h2>Key Concepts</h2>
                    <ul>
                        <li>Tip one: Be concise.</li>
                        <li>Tip two: Use active voice.</li>
                    </ul>
                    <blockquote>"Writing is thinking on paper."</blockquote>
                    <p>Conclusion paragraph.</p>`
            },
            {
                name: 'Resume Header',
                html: `<div style="text-align: center;">
                    <h1>Your Name</h1>
                    <p>Software Engineer | Designer | Creator</p>
                    <p>email@example.com • (555) 123-4567</p>
                    <hr>
                </div>`
            }
        ];
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('template', {
            title: 'Insert Template',
            icon: Icons.template,
            command: 'insertTemplate',
            onAction: (editor) => {
                const dialog = new Dialog(editor);

                const list = document.createElement('div');
                list.style.cssText = 'display: flex; flex-direction: column; gap: 10px; max-height: 400px; overflow-y: auto;';

                this.templates.forEach(tpl => {
                    const item = document.createElement('div');
                    item.innerHTML = `<strong>${tpl.name}</strong>`;
                    item.style.cssText = 'padding: 15px; border: 1px solid #eee; border-radius: 6px; cursor: pointer; transition: background 0.2s;';
                    item.onmouseover = () => item.style.background = '#f5f5f5';
                    item.onmouseout = () => item.style.background = '#fff';
                    item.onclick = () => {
                        editor.selection.restoreSelection();
                        editor.execCommand('insertHTML', tpl.html);
                        dialog.close();
                    };
                    list.appendChild(item);
                });

                dialog.show({
                    title: 'Choose a Template',
                    content: ''
                });
                dialog.body.innerHTML = '';
                dialog.body.appendChild(list);
            }
        });
    }
}
