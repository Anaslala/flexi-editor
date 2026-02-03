import '../ui/theme.css';
import { CommandManager } from './CommandManager';
import { SelectionManager } from './SelectionManager';
import { PluginManager } from './PluginManager';
import { Toolbar } from '../ui/Toolbar';

// Plugins
import { ParagraphPlugin } from '../plugins/ParagraphPlugin';
import { BoldPlugin } from '../plugins/BoldPlugin';
import { ItalicPlugin } from '../plugins/ItalicPlugin';
import { UnderlinePlugin } from '../plugins/UnderlinePlugin';
import { ListPlugin } from '../plugins/ListPlugin';
import { HeadingPlugin } from '../plugins/HeadingPlugin';
import { ColorPlugin } from '../plugins/ColorPlugin';
import { ImagePlugin } from '../plugins/ImagePlugin';
import { AlignmentPlugin } from '../plugins/AlignmentPlugin';
import { LinkPlugin } from '../plugins/LinkPlugin';
import { TablePlugin } from '../plugins/TablePlugin';
import { ScriptPlugin } from '../plugins/ScriptPlugin';
import { ClearFormatPlugin } from '../plugins/ClearFormatPlugin';
import { HistoryPlugin } from '../plugins/HistoryPlugin';
import { BlockUtilsPlugin } from '../plugins/BlockUtilsPlugin';
import { CodePlugin } from '../plugins/CodePlugin';
import { StrikethroughPlugin } from '../plugins/StrikethroughPlugin';
import { VideoPlugin } from '../plugins/VideoPlugin';
import { SourceViewPlugin } from '../plugins/SourceViewPlugin';
import { FullscreenPlugin } from '../plugins/FullscreenPlugin';
import { PrintPlugin } from '../plugins/PrintPlugin';
import { SelectAllPlugin } from '../plugins/SelectAllPlugin';
import { DateTimePlugin } from '../plugins/DateTimePlugin';
import { FindReplacePlugin } from '../plugins/FindReplacePlugin';
import { WordCountPlugin } from '../plugins/WordCountPlugin';
import { EmojiPlugin } from '../plugins/EmojiPlugin';
import { SpecialCharPlugin } from '../plugins/SpecialCharPlugin';
import { FontPlugin } from '../plugins/FontPlugin';
import { DictationPlugin } from '../plugins/DictationPlugin';
import { TemplatePlugin } from '../plugins/TemplatePlugin';
import { LineHeightPlugin } from '../plugins/LineHeightPlugin';
import { TextTransformPlugin } from '../plugins/TextTransformPlugin';
import { LetterSpacingPlugin } from '../plugins/LetterSpacingPlugin';
import { AutoSavePlugin } from '../plugins/AutoSavePlugin';
import { SmartPastePlugin } from '../plugins/SmartPastePlugin';
import { ImageUploadPlugin } from '../plugins/ImageUploadPlugin';
import { FloatingToolbarPlugin } from '../plugins/FloatingToolbarPlugin';
import { SlashCommandsPlugin } from '../plugins/SlashCommandsPlugin';
import { DragDropBlocksPlugin } from '../plugins/DragDropBlocksPlugin';
import { KeyboardShortcutsPlugin } from '../plugins/KeyboardShortcutsPlugin';
import { ContentQualityPlugin } from '../plugins/ContentQualityPlugin';
import { DividerPlugin } from '../plugins/DividerPlugin';
import { PageBreakPlugin } from '../plugins/PageBreakPlugin';
import { TableOfContentsPlugin } from '../plugins/TableOfContentsPlugin';
import { CalloutPlugin } from '../plugins/CalloutPlugin';
import { ToggleBlockPlugin } from '../plugins/ToggleBlockPlugin';
import { FootnotePlugin } from '../plugins/FootnotePlugin';
import { ContextMenuPlugin } from '../plugins/ContextMenuPlugin';
// import { AIPlugin } from '../plugins/AIPlugin';

export default class FlexiEditor {
    constructor(config = {}) {
        this.config = {
            element: null,
            content: '',
            placeholder: 'Type here...',
            readOnly: false,
            theme: 'default',
            plugins: [],
            sanitize: false, // Disabled to allow Code Block syntax highlighting
            ...config
        };

        if (!this.config.element) {
            throw new Error('FlexiEditor requires an element to mount');
        }

        this.element = this.config.element;
        this.events = {};
        this.isReady = false;
        this.eventListeners = [];

        try {
            this.init();
        } catch (error) {
            console.error('FlexiEditor initialization failed:', error);
            throw error;
        }
    }

    init() {
        // Managers
        this.commands = new CommandManager(this);
        this.selection = new SelectionManager(this);
        this.plugins = new PluginManager(this);

        // UI Setup
        this.setupUI();

        // Bind Events
        this.bindEvents();

        // Load Plugins
        this.loadPlugins();

        // Set Initial Content
        this.setData(this.config.content);

        this.isReady = true;
        this.trigger('ready');
    }

    setupUI() {
        this.element.classList.add('editor-container');

        // Content Area
        this.contentArea = document.createElement('div');
        this.contentArea.className = 'editor-content';
        this.contentArea.contentEditable = !this.config.readOnly;
        this.contentArea.setAttribute('role', 'textbox');
        this.contentArea.setAttribute('aria-multiline', 'true');
        this.contentArea.innerHTML = '';

        if (this.config.placeholder) {
            this.contentArea.setAttribute('data-placeholder', this.config.placeholder);
        }

        this.element.appendChild(this.contentArea);

        // Initialize Toolbar
        if (this.config.toolbar) {
            this.toolbar = new Toolbar(this, this.config.toolbar);
        } else {
            const toolbarContainer = document.createElement('div');
            this.element.insertBefore(toolbarContainer, this.contentArea);
            this.toolbar = new Toolbar(this, toolbarContainer);
        }
    }

    bindEvents() {
        const handlers = {
            input: (e) => {
                this.trigger('change', e);
            },
            keydown: (e) => {
                this.trigger('keydown', e);
                this.handleKeyboardShortcuts(e);
            },
            keyup: (e) => {
                this.selection.saveSelection();
                this.trigger('keyup', e);
            },
            mouseup: (e) => {
                this.selection.saveSelection();
                this.trigger('mouseup', e);
                this.trigger('selection-change');
            },
            focus: (e) => {
                this.trigger('focus', e);
            },
            blur: (e) => {
                this.trigger('blur', e);
            },
            paste: (e) => {
                if (this.config.sanitize) {
                    this.handlePaste(e);
                }
            }
        };

        // Store listeners for cleanup
        Object.entries(handlers).forEach(([event, handler]) => {
            this.contentArea.addEventListener(event, handler);
            this.eventListeners.push({ element: this.contentArea, event, handler });
        });
    }

    handleKeyboardShortcuts(e) {
        const ctrl = e.ctrlKey || e.metaKey;

        if (ctrl) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    this.execCommand('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.execCommand('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    this.execCommand('underline');
                    break;
                case 'z':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.execCommand('redo');
                    } else {
                        e.preventDefault();
                        this.execCommand('undo');
                    }
                    break;
            }
        }
    }

    handlePaste(e) {
        // e.preventDefault(); // Don't prevent default immediately? 
        // Actually, if we want to handle it (sanitize), we MUST prevent default.
        e.preventDefault();

        console.log('Paste event triggered');
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) {
            console.warn('No clipboard data found');
            return;
        }

        let pastedData = clipboardData.getData('text/html');
        if (!pastedData) {
            pastedData = clipboardData.getData('text/plain');
            // Wrap plain text in p lines if needed, or let execCommand handle it
            if (pastedData) {
                // Convert newlines to breaks for plain text if inserting as HTML
                pastedData = pastedData.replace(/\n/g, '<br>');
            }
        }

        if (pastedData) {
            // Basic sanitization
            if (this.config.sanitize) {
                pastedData = this.sanitizeHTML(pastedData);
            }

            // Fallback: If sanitization results in empty/whitespace, try plain text
            if (!pastedData || !pastedData.trim()) {
                pastedData = clipboardData.getData('text/plain');
                if (pastedData) pastedData = pastedData.replace(/\n/g, '<br>');
            }

            if (pastedData && pastedData.trim()) {
                console.log('Inserting content...');
                this.execCommand('insertHTML', pastedData);
            }
        } else {
            console.warn('No text/html or text/plain data found in clipboard');
        }
    }

    sanitizeHTML(html) {
        // Basic HTML sanitization
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove script tags
        temp.querySelectorAll('script, style, iframe, object, embed').forEach(el => el.remove());

        // Remove event handlers and styles (to prevent invisible text from dark mode sites)
        temp.querySelectorAll('*').forEach(el => {
            // Remove all attributes except href, src, alt, title, rowspan, colspan
            const allowedAttrs = ['href', 'src', 'alt', 'title', 'rowspan', 'colspan', 'target'];
            Array.from(el.attributes).forEach(attr => {
                if (!allowedAttrs.includes(attr.name)) {
                    el.removeAttribute(attr.name);
                }
            });

            // Specifically ensure no inline styles
            el.removeAttribute('style');
        });

        return temp.innerHTML;
    }

    loadPlugins() {
        const defaultPlugins = [
            { name: 'Paragraph', class: ParagraphPlugin },
            { name: 'Bold', class: BoldPlugin },
            { name: 'Italic', class: ItalicPlugin },
            { name: 'Underline', class: UnderlinePlugin },
            { name: 'Strikethrough', class: StrikethroughPlugin },
            { name: 'List', class: ListPlugin },
            { name: 'Heading', class: HeadingPlugin },
            { name: 'Color', class: ColorPlugin },
            { name: 'Font', class: FontPlugin },
            { name: 'ClearFormat', class: ClearFormatPlugin },
            { name: 'Alignment', class: AlignmentPlugin },
            { name: 'Link', class: LinkPlugin },
            { name: 'Image', class: ImagePlugin },
            { name: 'Video', class: VideoPlugin },
            { name: 'Table', class: TablePlugin },
            { name: 'BlockUtils', class: BlockUtilsPlugin },
            { name: 'Code', class: CodePlugin },
            { name: 'Script', class: ScriptPlugin },
            { name: 'History', class: HistoryPlugin },
            { name: 'SourceView', class: SourceViewPlugin },
            { name: 'Fullscreen', class: FullscreenPlugin },
            { name: 'Print', class: PrintPlugin },
            { name: 'SelectAll', class: SelectAllPlugin },
            { name: 'DateTime', class: DateTimePlugin },
            { name: 'FindReplace', class: FindReplacePlugin },
            { name: 'WordCount', class: WordCountPlugin },
            { name: 'Emoji', class: EmojiPlugin },
            { name: 'SpecialChar', class: SpecialCharPlugin },
            { name: 'Dictation', class: DictationPlugin },
            { name: 'Template', class: TemplatePlugin },
            { name: 'LineHeight', class: LineHeightPlugin },
            { name: 'TextTransform', class: TextTransformPlugin },
            { name: 'LetterSpacingPlugin', class: LetterSpacingPlugin },
            {
                name: 'AutoSave',
                class: AutoSavePlugin,
                options: {
                    saveAdapter: (data) => {
                        console.log('AutoSaving to localStorage...');
                        localStorage.setItem('flexi-editor-content', data);
                        return Promise.resolve();
                    },
                    loadAdapter: () => {
                        return Promise.resolve(localStorage.getItem('flexi-editor-content'));
                    }
                }
            },
            { name: 'SmartPaste', class: SmartPastePlugin },
            { name: 'ImageUpload', class: ImageUploadPlugin },
            { name: 'FloatingToolbar', class: FloatingToolbarPlugin },
            { name: 'SlashCommands', class: SlashCommandsPlugin },
            { name: 'DragDropBlocks', class: DragDropBlocksPlugin },
            { name: 'DragDropBlocks', class: DragDropBlocksPlugin },
            { name: 'KeyboardShortcuts', class: KeyboardShortcutsPlugin },
            { name: 'Divider', class: DividerPlugin },
            { name: 'PageBreak', class: PageBreakPlugin },
            { name: 'TableOfContents', class: TableOfContentsPlugin },
            { name: 'Callout', class: CalloutPlugin },
            { name: 'ToggleBlock', class: ToggleBlockPlugin },
            { name: 'Footnote', class: FootnotePlugin }
        ];

        // Register default plugins
        defaultPlugins.forEach(({ name, class: PluginClass }) => {
            if (!this.plugins.get(name)) {
                try {
                    this.plugins.register(PluginClass);
                } catch (error) {
                    console.error(`Failed to register plugin ${name}:`, error);
                }
            }
        });

        // Register user plugins
        this.config.plugins.forEach(plugin => {
            try {
                this.plugins.register(plugin);
            } catch (error) {
                console.error('Failed to register custom plugin:', error);
            }
        });

        // Initialize all plugins
        try {
            this.plugins.initAll();
        } catch (error) {
            console.error('Plugin initialization failed:', error);
        }
    }

    /**
     * Data handling
     */
    getData() {
        return this.contentArea.innerHTML;
    }

    setData(html) {
        if (this.config.sanitize && html) {
            html = this.sanitizeHTML(html);
        }
        this.contentArea.innerHTML = html || '';
        this.trigger('change');
    }

    /**
     * Command Execution
     */
    execCommand(commandName, value = null) {
        try {
            // Restore selection before executing command
            this.selection.restoreSelection();

            // Ensure focus
            if (document.activeElement !== this.contentArea) {
                this.contentArea.focus();
            }

            // Execute command
            document.execCommand(commandName, false, value);

            // Save selection after command
            this.selection.saveSelection();

            // Trigger events
            this.trigger('change');
            this.trigger('selection-change');
        } catch (error) {
            console.error(`Command execution failed: ${commandName}`, error);
        }
    }

    /**
     * Event Bus
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    trigger(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(cb => {
                try {
                    cb(data);
                } catch (error) {
                    console.error(`Event handler error for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        // Destroy plugins
        try {
            this.plugins.destroyAll();
        } catch (error) {
            console.error('Plugin cleanup failed:', error);
        }

        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];

        // Clear content
        this.element.innerHTML = '';

        // Clear events
        this.events = {};

        // Clear references
        this.contentArea = null;
        this.toolbar = null;
        this.isReady = false;
    }
}
