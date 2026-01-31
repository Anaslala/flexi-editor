# Flexi Editor - Complete Features Documentation

## 📋 Overview

Flexi Editor comes with **41 built-in plugins** providing comprehensive rich text editing capabilities. This document lists all available features and tools.

---

## 🎨 Text Formatting (9 Tools)

### 1. **Bold** ✅
- **Shortcut:** Ctrl/Cmd + B
- **Function:** Make text bold
- **Usage:** Select text and click Bold button or use keyboard shortcut
- **Plugin:** `BoldPlugin`

### 2. **Italic** ✅
- **Shortcut:** Ctrl/Cmd + I
- **Function:** Make text italic
- **Usage:** Select text and click Italic button or use keyboard shortcut
- **Plugin:** `ItalicPlugin`

### 3. **Underline** ✅
- **Shortcut:** Ctrl/Cmd + U
- **Function:** Underline text
- **Usage:** Select text and click Underline button or use keyboard shortcut
- **Plugin:** `UnderlinePlugin`

### 4. **Strikethrough** ✅
- **Function:** Strike through text
- **Usage:** Select text and click Strikethrough button
- **Plugin:** `StrikethroughPlugin`

### 5. **Superscript** ✅
- **Function:** Make text superscript (e.g., x²)
- **Usage:** Select text and apply superscript
- **Plugin:** `ScriptPlugin`

### 6. **Subscript** ✅
- **Function:** Make text subscript (e.g., H₂O)
- **Usage:** Select text and apply subscript
- **Plugin:** `ScriptPlugin`

### 7. **Text Color** ✅
- **Function:** Change text color
- **Usage:** Select text and choose color from color picker
- **Plugin:** `ColorPlugin`

### 8. **Background Color** ✅
- **Function:** Change text background color (highlight)
- **Usage:** Select text and choose background color
- **Plugin:** `ColorPlugin`

### 9. **Clear Formatting** ✅
- **Function:** Remove all formatting from selected text
- **Usage:** Select formatted text and click Clear Format button
- **Plugin:** `ClearFormatPlugin`

---

## 📝 Paragraph & Structure (5 Tools)

### 10. **Paragraph** ✅
- **Function:** Create normal paragraphs
- **Usage:** Default text format
- **Plugin:** `ParagraphPlugin`

### 11. **Headings (H1-H6)** ✅
- **Function:** Create heading levels 1 through 6
- **Usage:** Select heading level from dropdown
- **Plugin:** `HeadingPlugin`
- **Levels:**
  - H1 - Main title
  - H2 - Section heading
  - H3 - Subsection heading
  - H4-H6 - Smaller headings

### 12. **Ordered List** ✅
- **Function:** Create numbered lists (1, 2, 3...)
- **Usage:** Click Ordered List button
- **Plugin:** `ListPlugin`

### 13. **Unordered List** ✅
- **Function:** Create bullet point lists
- **Usage:** Click Unordered List button
- **Plugin:** `ListPlugin`

### 14. **Block Quote** ✅
- **Function:** Create block quotes
- **Usage:** Available through BlockUtils
- **Plugin:** `BlockUtilsPlugin`

---

## 🎯 Alignment (4 Tools)

### 15. **Align Left** ✅
- **Function:** Align text to the left
- **Usage:** Select text and click Align Left
- **Plugin:** `AlignmentPlugin`

### 16. **Align Center** ✅
- **Function:** Center align text
- **Usage:** Select text and click Align Center
- **Plugin:** `AlignmentPlugin`

### 17. **Align Right** ✅
- **Function:** Align text to the right
- **Usage:** Select text and click Align Right
- **Plugin:** `AlignmentPlugin`

### 18. **Justify** ✅
- **Function:** Justify text (align both left and right)
- **Usage:** Select text and click Justify
- **Plugin:** `AlignmentPlugin`

---

## 🔗 Links & Media (4 Tools)

### 19. **Insert Link** ✅
- **Function:** Add hyperlinks to text
- **Usage:** Select text, click Link button, enter URL
- **Features:**
  - Custom link text
  - Open in new tab option
  - Edit existing links
  - Remove links
- **Plugin:** `LinkPlugin`

### 20. **Insert Image** ✅
- **Function:** Add images to content
- **Usage:** Click Image button, enter image URL
- **Features:**
  - Image URL input
  - Alt text for accessibility
  - Responsive images
- **Plugin:** `ImagePlugin`

### 21. **Insert Video** ✅
- **Function:** Embed videos (YouTube, Vimeo, etc.)
- **Usage:** Click Video button, enter video URL
- **Features:**
  - YouTube embed support
  - Vimeo embed support
  - Custom video URLs
- **Plugin:** `VideoPlugin`

### 22. **Insert Table** ✅
- **Function:** Create and edit tables
- **Usage:** Click Table button, specify rows and columns
- **Features:**
  - Custom rows and columns
  - Add/remove rows
  - Add/remove columns
  - Table styling
- **Plugin:** `TablePlugin`

---

## 🎨 Advanced Formatting (7 Tools)

### 23. **Font Family** ✅
- **Function:** Change font family
- **Usage:** Select text and choose font from dropdown
- **Features:**
  - Google Fonts integration
  - Multiple font options
  - Custom fonts support
- **Plugin:** `FontPlugin`

### 24. **Font Size** ✅
- **Function:** Change text size
- **Usage:** Select text and choose size
- **Plugin:** `FontPlugin`

### 25. **Line Height** ✅
- **Function:** Adjust line spacing
- **Usage:** Select text and choose line height
- **Options:** 1.0, 1.5, 2.0, 2.5, 3.0
- **Plugin:** `LineHeightPlugin`

### 26. **Letter Spacing** ✅
- **Function:** Adjust spacing between letters
- **Usage:** Select text and adjust letter spacing
- **Plugin:** `LetterSpacingPlugin`

### 27. **Text Transform** ✅
- **Function:** Change text case
- **Usage:** Select text and choose transformation
- **Options:**
  - Uppercase
  - Lowercase
  - Capitalize
- **Plugin:** `TextTransformPlugin`

---

## 💻 Code & Special Content (3 Tools)

### 28. **Code Block** ✅
- **Function:** Insert code blocks with syntax highlighting
- **Usage:** Click Code button
- **Features:**
  - Monospace font
  - Preserved formatting
  - Syntax highlighting ready
- **Plugin:** `CodePlugin`

### 29. **Inline Code** ✅
- **Function:** Format text as inline code
- **Usage:** Select text and apply inline code format
- **Plugin:** `CodePlugin`

### 30. **Special Characters** ✅
- **Function:** Insert special characters and symbols
- **Usage:** Click Special Char button, select character
- **Features:**
  - Common symbols
  - Mathematical symbols
  - Currency symbols
  - Arrows and more
- **Plugin:** `SpecialCharPlugin`

---

## 😊 Content Insertion (3 Tools)

### 31. **Emoji Picker** ✅
- **Function:** Insert emojis into content
- **Usage:** Click Emoji button, select emoji
- **Features:**
  - Categorized emojis
  - Search functionality
  - Recently used emojis
- **Plugin:** `EmojiPlugin`

### 32. **Date & Time** ✅
- **Function:** Insert current date and time
- **Usage:** Click Date/Time button
- **Features:**
  - Current date
  - Current time
  - Custom formats
- **Plugin:** `DateTimePlugin`

### 33. **Templates** ✅
- **Function:** Insert pre-defined content templates
- **Usage:** Click Template button, select template
- **Features:**
  - Email templates
  - Document templates
  - Custom templates
- **Plugin:** `TemplatePlugin`

---

## 🔧 Editor Tools (9 Tools)

### 34. **Undo** ✅
- **Shortcut:** Ctrl/Cmd + Z
- **Function:** Undo last action
- **Usage:** Click Undo button or use keyboard shortcut
- **Plugin:** `HistoryPlugin`

### 35. **Redo** ✅
- **Shortcut:** Ctrl/Cmd + Shift + Z
- **Function:** Redo last undone action
- **Usage:** Click Redo button or use keyboard shortcut
- **Plugin:** `HistoryPlugin`

### 36. **Find & Replace** ✅
- **Function:** Search and replace text
- **Usage:** Click Find/Replace button
- **Features:**
  - Case sensitive search
  - Replace single occurrence
  - Replace all occurrences
  - Highlight matches
- **Plugin:** `FindReplacePlugin`

### 39. **Word Count** ✅
- **Function:** Display word and character count
- **Usage:** Automatically displayed in toolbar
- **Features:**
  - Word count
  - Character count
  - Real-time updates
- **Plugin:** `WordCountPlugin`

### 40. **Source View** ✅
- **Function:** View and edit HTML source code
- **Usage:** Click Source View button
- **Features:**
  - Toggle between visual and source mode
  - Edit raw HTML
  - Syntax highlighting
- **Plugin:** `SourceViewPlugin`

### 41. **Fullscreen Mode** ✅
- **Function:** Expand editor to fullscreen
- **Usage:** Click Fullscreen button
- **Features:**
  - Distraction-free editing
  - Toggle fullscreen
  - ESC to exit
- **Plugin:** `FullscreenPlugin`

### 42. **Print** ✅
- **Function:** Print editor content
- **Usage:** Click Print button
- **Features:**
  - Print preview
  - Clean print layout
  - Browser print dialog
- **Plugin:** `PrintPlugin`

### 43. **Select All** ✅
- **Shortcut:** Ctrl/Cmd + A
- **Function:** Select all content
- **Usage:** Click Select All button or use keyboard shortcut
- **Plugin:** `SelectAllPlugin`

### 44. **Voice Dictation** ✅
- **Function:** Voice-to-text input
- **Usage:** Click Dictation button and speak
- **Features:**
  - Speech recognition
  - Real-time transcription
  - Multiple languages support
- **Requirements:** Browser with Web Speech API support
- **Plugin:** `DictationPlugin`

---

## 📊 Feature Summary

### Total Features: 42 Tools

**By Category:**
- Text Formatting: 9 tools
- Paragraph & Structure: 5 tools
- Alignment: 4 tools
- Links & Media: 4 tools
- Advanced Formatting: 6 tools
- Code & Special Content: 3 tools
- Content Insertion: 3 tools
- Editor Tools: 9 tools

---

## 🎯 Preset Breakdown

### Basic Preset (7 plugins)
- Paragraph
- Bold, Italic, Underline
- Lists (Ordered/Unordered)
- Links
- Undo/Redo

### Standard Preset (15 plugins)
- All Basic features
- Strikethrough
- Headings (H1-H6)
- Alignment (Left/Center/Right/Justify)
- Images
- Text & Background Colors
- Clear Formatting
- Block Utilities
- Code Blocks

### Full Preset (41 plugins)
- All Standard features
- Videos
- Tables
- Fonts (Family & Size)
- Line Height
- Letter Spacing
- Text Transform
- Superscript/Subscript
- Special Characters
- Emojis
- Date & Time
- Templates
- Find & Replace
- Word Count
- Source View
- Fullscreen
- Print
- Select All
- Voice Dictation

---

## 🔌 Plugin Architecture

Each feature is implemented as a separate plugin, making the editor:
- **Modular** - Use only what you need
- **Extensible** - Add custom plugins easily
- **Maintainable** - Each plugin is independent
- **Performant** - Load only required features

---

## 🚀 Usage

### Load All Features (Default)
```javascript
const editor = new FlexiEditor({
    element: document.getElementById('editor')
});
// All 34 plugins loaded automatically
```

### Load Specific Preset
```javascript
// Basic features only
FlexiEditor.create('#editor', { preset: 'basic' });

// Standard features
FlexiEditor.create('#editor', { preset: 'standard' });

// All features
FlexiEditor.create('#editor', { preset: 'full' });
```

### Add Custom Plugins
```javascript
FlexiEditor.create('#editor', {
    preset: 'basic',
    plugins: [MyCustomPlugin]  // Add your own plugins
});
```

---

## 🎨 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Shift + Z | Redo |
| Ctrl/Cmd + A | Select All |

---

## 🌐 Browser Support

All features work in modern browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

**Note:** Voice Dictation requires Web Speech API support (Chrome, Edge)

---

## 📚 Additional Resources

- [README.md](./README.md) - Getting started guide
- [SIMPLE_API.md](./SIMPLE_API.md) - API documentation
- [USAGE.md](./USAGE.md) - Advanced usage
- [Examples](./examples/) - Code examples

---

**Made with ❤️ by Anas Kadival**
