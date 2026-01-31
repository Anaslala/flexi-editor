import { Dialog } from '../ui/Dialog';
import { Icons } from '../ui/Icons';

export class LinkPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Link';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('link', {
            title: 'Insert/Edit Link',
            icon: Icons.link,
            onAction: (editor) => {
                const existingLink = this.getSelectedLink();
                const selectedText = window.getSelection().toString();
                
                const dialog = new Dialog(editor);
                dialog.show({
                    title: existingLink ? 'Edit Link' : 'Insert Link',
                    fields: [
                        { 
                            name: 'url', 
                            label: 'URL', 
                            placeholder: 'https://example.com',
                            value: existingLink ? existingLink.href : '',
                            required: true
                        },
                        { 
                            name: 'text', 
                            label: 'Text to display', 
                            placeholder: 'Link text',
                            value: existingLink ? existingLink.textContent : selectedText
                        },
                        {
                            name: 'target',
                            label: 'Open in',
                            type: 'select',
                            options: [
                                { value: '_self', text: 'Same window' },
                                { value: '_blank', text: 'New window' }
                            ],
                            value: existingLink ? existingLink.target || '_self' : '_self'
                        }
                    ],
                    onSave: (data) => {
                        if (data.url) {
                            // Validate URL
                            const url = this.validateURL(data.url);
                            if (!url) {
                                alert('Please enter a valid URL');
                                return;
                            }
                            
                            editor.selection.restoreSelection();
                            
                            if (existingLink) {
                                // Edit existing link
                                existingLink.href = url;
                                if (data.text) existingLink.textContent = data.text;
                                existingLink.target = data.target || '_self';
                            } else {
                                // Create new link
                                const text = data.text || data.url;
                                const link = document.createElement('a');
                                link.href = url;
                                link.textContent = text;
                                link.target = data.target || '_self';
                                
                                const range = editor.selection.getRange();
                                if (range) {
                                    range.deleteContents();
                                    range.insertNode(link);
                                    range.collapse(false);
                                }
                            }
                        }
                    }
                });
            },
            checkActive: () => {
                return !!this.getSelectedLink();
            }
        });

        this.editor.toolbar.registerButton('unlink', {
            title: 'Remove Link',
            icon: '🔗✕',
            command: 'unlink',
            onAction: (editor) => {
                const link = this.getSelectedLink();
                if (link) {
                    const text = document.createTextNode(link.textContent);
                    link.parentNode.replaceChild(text, link);
                } else {
                    editor.execCommand('unlink');
                }
            }
        });
    }

    getSelectedLink() {
        const selection = this.editor.selection.getSelection();
        if (!selection || selection.rangeCount === 0) return null;
        
        let node = selection.anchorNode;
        while (node && node !== this.editor.contentArea) {
            if (node.nodeName === 'A') {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }

    validateURL(url) {
        if (!url) return null;
        
        // Add protocol if missing
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        
        // Basic URL validation
        try {
            new URL(url);
            return url;
        } catch (e) {
            return null;
        }
    }
}
