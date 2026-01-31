import { Icons } from '../ui/Icons';
import { getEmojisByCategory, getAllEmojis, searchEmojis } from '../data/emojiData';

export class EmojiPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'Emoji';
        this.emojisByCategory = getEmojisByCategory();
        this.allEmojis = getAllEmojis();
        this.recentEmojis = this.loadRecentEmojis();
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('emoji', {
            title: 'Insert Emoji',
            icon: Icons.emoji,
            command: 'insertEmoji',
            onAction: (editor) => {
                this.showEmojiPicker();
            }
        });
    }

    showEmojiPicker() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const picker = document.createElement('div');
        picker.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            width: 450px;
            max-width: 90vw;
            max-height: 550px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        const header = document.createElement('div');
        header.style.cssText = 'padding: 16px; border-bottom: 1px solid #e5e7eb;';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search emoji...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #c4c4c4;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
        `;
        searchInput.onfocus = () => {
            searchInput.style.borderColor = '#1b9af7';
            searchInput.style.boxShadow = '0 0 0 1px #1b9af7';
        };
        searchInput.onblur = () => {
            searchInput.style.borderColor = '#c4c4c4';
            searchInput.style.boxShadow = 'none';
        };

        header.appendChild(searchInput);

        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 12px;
        `;

        const renderEmojis = (filter = '') => {
            content.innerHTML = '';
            const filterLower = filter.toLowerCase().trim();

            if (!filterLower && this.recentEmojis.length > 0) {
                const recentSection = this.createEmojiSection('Recently Used', this.recentEmojis, overlay);
                content.appendChild(recentSection);
            }

            if (filterLower) {
                const filtered = searchEmojis(filterLower);
                
                if (filtered.length > 0) {
                    const section = this.createEmojiSection('Search Results', filtered.slice(0, 100), overlay);
                    content.appendChild(section);
                } else {
                    content.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">No emojis found</div>';
                }
            } else {
                for (const [category, emojis] of Object.entries(this.emojisByCategory)) {
                    const section = this.createEmojiSection(category, emojis, overlay);
                    content.appendChild(section);
                }
            }
        };

        searchInput.oninput = (e) => renderEmojis(e.target.value);
        renderEmojis();

        picker.appendChild(header);
        picker.appendChild(content);
        overlay.appendChild(picker);
        document.body.appendChild(overlay);

        setTimeout(() => searchInput.focus(), 50);

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    createEmojiSection(title, emojis, overlay) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 16px;';

        const titleEl = document.createElement('div');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            font-size: 12px;
            font-weight: 700;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
            gap: 4px;
        `;

        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = emoji;
            btn.style.cssText = `
                font-size: 28px;
                padding: 8px;
                border: none;
                background: transparent;
                cursor: pointer;
                border-radius: 6px;
                transition: background 0.15s;
            `;
            btn.onmouseenter = () => btn.style.background = '#f3f4f6';
            btn.onmouseleave = () => btn.style.background = 'transparent';
            btn.onclick = () => {
                this.insertEmoji(emoji);
                this.addToRecent(emoji);
                overlay.remove();
            };
            grid.appendChild(btn);
        });

        section.appendChild(titleEl);
        section.appendChild(grid);
        return section;
    }

    insertEmoji(emoji) {
        this.editor.selection.restoreSelection();
        this.editor.contentArea.focus();
        this.editor.execCommand('insertText', emoji);
        this.editor.trigger('change');
    }

    addToRecent(emoji) {
        this.recentEmojis = this.recentEmojis.filter(e => e !== emoji);
        this.recentEmojis.unshift(emoji);
        this.recentEmojis = this.recentEmojis.slice(0, 32);
        this.saveRecentEmojis();
    }

    loadRecentEmojis() {
        try {
            const saved = localStorage.getItem('flexi-editor-recent-emojis');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    saveRecentEmojis() {
        try {
            localStorage.setItem('flexi-editor-recent-emojis', JSON.stringify(this.recentEmojis));
        } catch {}
    }
}
