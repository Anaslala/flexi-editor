import { Icons } from '../ui/Icons';

export class SpecialCharPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'SpecialChar';
        
        // Organized special characters with categories and keywords
        this.charData = {
            'Currency': [
                { char: '€', name: 'Euro', keywords: 'euro currency money' },
                { char: '£', name: 'Pound', keywords: 'pound sterling currency money' },
                { char: '¥', name: 'Yen', keywords: 'yen yuan currency money' },
                { char: '$', name: 'Dollar', keywords: 'dollar currency money' },
                { char: '¢', name: 'Cent', keywords: 'cent currency money' },
                { char: '₹', name: 'Rupee', keywords: 'rupee currency money india' },
                { char: '₽', name: 'Ruble', keywords: 'ruble currency money russia' },
                { char: '₩', name: 'Won', keywords: 'won currency money korea' }
            ],
            'Math & Logic': [
                { char: '±', name: 'Plus Minus', keywords: 'plus minus math' },
                { char: '×', name: 'Multiply', keywords: 'multiply times math' },
                { char: '÷', name: 'Divide', keywords: 'divide division math' },
                { char: '=', name: 'Equals', keywords: 'equals equal math' },
                { char: '≠', name: 'Not Equal', keywords: 'not equal math' },
                { char: '≈', name: 'Approximately', keywords: 'approximately almost math' },
                { char: '≤', name: 'Less Than Equal', keywords: 'less than equal math' },
                { char: '≥', name: 'Greater Than Equal', keywords: 'greater than equal math' },
                { char: '<', name: 'Less Than', keywords: 'less than math' },
                { char: '>', name: 'Greater Than', keywords: 'greater than math' },
                { char: '∞', name: 'Infinity', keywords: 'infinity infinite math' },
                { char: '∑', name: 'Sum', keywords: 'sum total math' },
                { char: '√', name: 'Square Root', keywords: 'square root math' },
                { char: '∫', name: 'Integral', keywords: 'integral calculus math' },
                { char: '∂', name: 'Partial', keywords: 'partial derivative math' },
                { char: '∆', name: 'Delta', keywords: 'delta change math' },
                { char: 'π', name: 'Pi', keywords: 'pi math circle' },
                { char: '%', name: 'Percent', keywords: 'percent percentage math' },
                { char: '‰', name: 'Per Mille', keywords: 'per mille thousand math' }
            ],
            'Greek Letters': [
                { char: 'α', name: 'Alpha', keywords: 'alpha greek letter' },
                { char: 'β', name: 'Beta', keywords: 'beta greek letter' },
                { char: 'γ', name: 'Gamma', keywords: 'gamma greek letter' },
                { char: 'δ', name: 'Delta', keywords: 'delta greek letter' },
                { char: 'ε', name: 'Epsilon', keywords: 'epsilon greek letter' },
                { char: 'θ', name: 'Theta', keywords: 'theta greek letter' },
                { char: 'λ', name: 'Lambda', keywords: 'lambda greek letter' },
                { char: 'μ', name: 'Mu', keywords: 'mu micro greek letter' },
                { char: 'π', name: 'Pi', keywords: 'pi greek letter' },
                { char: 'σ', name: 'Sigma', keywords: 'sigma greek letter' },
                { char: 'φ', name: 'Phi', keywords: 'phi greek letter' },
                { char: 'ω', name: 'Omega', keywords: 'omega greek letter' }
            ],
            'Arrows': [
                { char: '←', name: 'Left Arrow', keywords: 'left arrow back' },
                { char: '→', name: 'Right Arrow', keywords: 'right arrow forward' },
                { char: '↑', name: 'Up Arrow', keywords: 'up arrow' },
                { char: '↓', name: 'Down Arrow', keywords: 'down arrow' },
                { char: '↔', name: 'Left Right Arrow', keywords: 'left right arrow both' },
                { char: '↕', name: 'Up Down Arrow', keywords: 'up down arrow vertical' },
                { char: '⇐', name: 'Double Left', keywords: 'double left arrow' },
                { char: '⇒', name: 'Double Right', keywords: 'double right arrow' },
                { char: '⇑', name: 'Double Up', keywords: 'double up arrow' },
                { char: '⇓', name: 'Double Down', keywords: 'double down arrow' }
            ],
            'Symbols': [
                { char: '©', name: 'Copyright', keywords: 'copyright symbol' },
                { char: '®', name: 'Registered', keywords: 'registered trademark symbol' },
                { char: '™', name: 'Trademark', keywords: 'trademark symbol' },
                { char: '§', name: 'Section', keywords: 'section paragraph symbol' },
                { char: '¶', name: 'Paragraph', keywords: 'paragraph pilcrow symbol' },
                { char: '†', name: 'Dagger', keywords: 'dagger symbol' },
                { char: '‡', name: 'Double Dagger', keywords: 'double dagger symbol' },
                { char: '•', name: 'Bullet', keywords: 'bullet point dot' },
                { char: '·', name: 'Middle Dot', keywords: 'middle dot center' },
                { char: '…', name: 'Ellipsis', keywords: 'ellipsis dots three' },
                { char: '°', name: 'Degree', keywords: 'degree temperature angle' },
                { char: '′', name: 'Prime', keywords: 'prime minute feet' },
                { char: '″', name: 'Double Prime', keywords: 'double prime second inches' },
                { char: '‹', name: 'Single Left Quote', keywords: 'single left angle quote' },
                { char: '›', name: 'Single Right Quote', keywords: 'single right angle quote' },
                { char: '«', name: 'Double Left Quote', keywords: 'double left angle quote' },
                { char: '»', name: 'Double Right Quote', keywords: 'double right angle quote' },
                { char: '"', name: 'Left Quote', keywords: 'left double quote' },
                { char: '"', name: 'Right Quote', keywords: 'right double quote' },
                { char: '\u2018', name: 'Left Single Quote', keywords: 'left single quote apostrophe' },
                { char: '\u2019', name: 'Right Single Quote', keywords: 'right single quote apostrophe' },
                { char: '—', name: 'Em Dash', keywords: 'em dash long' },
                { char: '–', name: 'En Dash', keywords: 'en dash medium' },
                { char: '‐', name: 'Hyphen', keywords: 'hyphen dash' },
                { char: '¡', name: 'Inverted Exclamation', keywords: 'inverted exclamation spanish' },
                { char: '¿', name: 'Inverted Question', keywords: 'inverted question spanish' },
                { char: '♠', name: 'Spade', keywords: 'spade card suit' },
                { char: '♣', name: 'Club', keywords: 'club card suit' },
                { char: '♥', name: 'Heart', keywords: 'heart card suit' },
                { char: '♦', name: 'Diamond', keywords: 'diamond card suit' },
                { char: '★', name: 'Star', keywords: 'star filled' },
                { char: '☆', name: 'Star Outline', keywords: 'star outline empty' },
                { char: '✓', name: 'Check Mark', keywords: 'check mark tick yes' },
                { char: '✗', name: 'X Mark', keywords: 'x mark cross no' },
                { char: '☐', name: 'Checkbox', keywords: 'checkbox empty square' },
                { char: '☑', name: 'Checked Box', keywords: 'checked box tick' },
                { char: '☒', name: 'X Box', keywords: 'x box crossed' }
            ]
        };
    }

    init() {
        if (!this.editor.toolbar) return;

        this.editor.toolbar.registerButton('specialChar', {
            title: 'Insert Special Character',
            icon: Icons.special,
            command: 'insertSpecialChar',
            onAction: (editor) => {
                this.showCharacterPicker();
            }
        });
    }

    showCharacterPicker() {
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

        // Header with title and search
        const header = document.createElement('div');
        header.style.cssText = 'padding: 16px; border-bottom: 1px solid #e5e7eb;';

        const title = document.createElement('h3');
        title.textContent = 'Special Characters';
        title.style.cssText = 'margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: #1f2937;';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search characters...';
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

        header.appendChild(title);
        header.appendChild(searchInput);

        // Content area
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 12px;
        `;

        const renderCharacters = (filter = '') => {
            content.innerHTML = '';
            const filterLower = filter.toLowerCase().trim();

            if (filterLower) {
                // Search mode
                const results = [];
                for (const [category, chars] of Object.entries(this.charData)) {
                    chars.forEach(item => {
                        if (item.keywords.includes(filterLower) || item.name.toLowerCase().includes(filterLower)) {
                            results.push(item);
                        }
                    });
                }

                if (results.length > 0) {
                    const section = this.createCharSection('Search Results', results, overlay);
                    content.appendChild(section);
                } else {
                    content.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">No characters found</div>';
                }
            } else {
                // Show all categories
                for (const [category, chars] of Object.entries(this.charData)) {
                    const section = this.createCharSection(category, chars, overlay);
                    content.appendChild(section);
                }
            }
        };

        searchInput.oninput = (e) => renderCharacters(e.target.value);
        renderCharacters();

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

    createCharSection(title, chars, overlay) {
        const section = document.createElement('div');
        section.style.cssText = 'margin-bottom: 20px;';

        const titleEl = document.createElement('div');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            font-size: 12px;
            font-weight: 700;
            color: #6b7280;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        `;

        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
            gap: 8px;
        `;

        chars.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 12px 8px;
                border: 1px solid #e5e7eb;
                background: white;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.15s;
                min-height: 70px;
            `;

            const charEl = document.createElement('div');
            charEl.textContent = item.char;
            charEl.style.cssText = 'font-size: 24px; margin-bottom: 4px;';

            const nameEl = document.createElement('div');
            nameEl.textContent = item.name;
            nameEl.style.cssText = 'font-size: 9px; color: #6b7280; text-align: center; line-height: 1.2;';

            btn.appendChild(charEl);
            btn.appendChild(nameEl);

            btn.onmouseenter = () => {
                btn.style.background = '#f3f4f6';
                btn.style.borderColor = '#1b9af7';
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            };
            btn.onmouseleave = () => {
                btn.style.background = 'white';
                btn.style.borderColor = '#e5e7eb';
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            };

            btn.onclick = () => {
                this.insertCharacter(item.char);
                overlay.remove();
            };

            grid.appendChild(btn);
        });

        section.appendChild(titleEl);
        section.appendChild(grid);
        return section;
    }

    insertCharacter(char) {
        this.editor.selection.restoreSelection();
        this.editor.contentArea.focus();
        this.editor.execCommand('insertText', char);
        this.editor.trigger('change');
    }
}
