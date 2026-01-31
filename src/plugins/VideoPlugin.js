import { Dialog } from '../ui/Dialog';
import { Icons } from '../ui/Icons';

export class VideoPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Video';
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('video', {
            title: 'Insert Video',
            icon: Icons.video,
            command: 'insertVideo',
            onAction: async (editor) => {
                const dialog = new Dialog(editor);
                dialog.show({
                    title: 'Insert Video',
                    fields: [
                        { name: 'url', label: 'Video URL (YouTube/Vimeo)', placeholder: 'https://...' }
                    ],
                    onSave: (data) => {
                        if (data.url) {
                            editor.selection.restoreSelection();
                            this.embedVideo(editor, data.url);
                        }
                    }
                });
            }
        });
    }

    embedVideo(editor, url) {
        let embedUrl = null;

        // Simple regex for YouTube and Vimeo
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

        if (ytMatch) {
            embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
        } else if (vimeoMatch) {
            embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        if (embedUrl) {
            const html = `<div class="editor-video-wrapper" style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin: 10px 0;">
                <iframe src="${embedUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allowfullscreen></iframe>
            </div><p><br></p>`;
            editor.execCommand('insertHTML', html);
        } else {
            alert('Invalid Video URL. Only YouTube and Vimeo are supported.');
        }
    }
}
