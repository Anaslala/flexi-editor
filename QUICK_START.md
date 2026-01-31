# Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Install

```bash
npm install flexi-editor
```

### Step 2: Import

```javascript
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';
```

### Step 3: Create

```javascript
const editor = new FlexiEditor({
    element: document.getElementById('editor'),
    placeholder: 'Start typing...'
});
```

That's it! 🎉

## 📦 Package Info

- **Size**: ~60KB minified (16KB gzipped)
- **Dependencies**: Zero runtime dependencies
- **Browser Support**: All modern browsers
- **Framework**: Works with React, Vue, Angular, or vanilla JS

## 🎯 Common Use Cases

### Get/Set Content

```javascript
// Get content
const html = editor.getData();

// Set content
editor.setData('<p>New content</p>');
```

### Listen to Changes

```javascript
editor.on('change', () => {
    const content = editor.getData();
    console.log('Content:', content);
});
```

### Save to Backend

```javascript
editor.on('change', async () => {
    const content = editor.getData();
    await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' }
    });
});
```

## 🎨 Customize Theme

```css
:root {
    --editor-primary: #your-color;
    --editor-bg: #ffffff;
    --editor-border: #e5e7eb;
}
```

## 📱 Responsive by Default

The editor automatically adapts to mobile and desktop screens.

## 🔌 Available Plugins

All plugins are included by default:
- Text formatting (Bold, Italic, Underline)
- Headings (H1-H6)
- Lists (Ordered, Unordered)
- Links and Images
- Tables
- Code blocks
- Colors and Fonts
- Undo/Redo
- And 20+ more!

## 📚 Full Documentation

- [README.md](./README.md) - Complete documentation
- [USAGE.md](./USAGE.md) - Detailed usage guide
- [PUBLISHING.md](./PUBLISHING.md) - How to publish to NPM

## 💡 Examples

Check the `examples/` folder for:
- Vanilla JavaScript
- React component
- Vue component

## 🆘 Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/yourusername/flexi-editor/issues)
- 💬 [Discussions](https://github.com/yourusername/flexi-editor/discussions)

## ⭐ Like it?

Give us a star on [GitHub](https://github.com/yourusername/flexi-editor)!
