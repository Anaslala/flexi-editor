# Rich Text Editor

A lightweight, modern, and extensible rich text editor with a clean plugin architecture. Perfect for content management systems, blogs, and any application requiring rich text editing capabilities.

## ✨ Features

- 🎨 **Clean & Modern UI** - Minimal design that fits any application
- 🔌 **Plugin Architecture** - Easily extend with custom plugins
- 📱 **Fully Responsive** - Works perfectly on mobile and desktop
- ⚡ **Lightweight** - Small bundle size (~50KB minified)
- 🎯 **Zero Dependencies** - No external runtime dependencies
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 🎨 **Customizable** - Easy to theme with CSS variables

## 📦 Installation

```bash
npm install flexi-editor
```

Or with yarn:

```bash
yarn add flexi-editor
```

Or with CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/flexi-editor/dist/style.css">
<script src="https://unpkg.com/flexi-editor/dist/flexi-editor.umd.js"></script>
```

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="node_modules/flexi-editor/dist/style.css">
</head>
<body>
    <div id="editor"></div>

    <script type="module">
        import FlexiEditor from 'flexi-editor';

        const editor = new FlexiEditor({
            element: document.getElementById('editor'),
            placeholder: 'Start typing...',
            content: '<p>Hello World!</p>'
        });
    </script>
</body>
</html>
```

### With Module Bundler (Webpack, Vite, etc.)

```javascript
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

const editor = new FlexiEditor({
    element: document.getElementById('editor'),
    placeholder: 'Start typing...',
    content: '<p>Hello World!</p>'
});
```

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

function FlexiEditorComponent() {
    const editorRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !instanceRef.current) {
            instanceRef.current = new FlexiEditor({
                element: editorRef.current,
                placeholder: 'Start typing...',
                content: '<p>Hello from React!</p>'
            });
        }

        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy();
            }
        };
    }, []);

    return <div ref={editorRef} />;
}

export default FlexiEditorComponent;
```

### Vue Integration

```vue
<template>
    <div ref="editorElement"></div>
</template>

<script>
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

export default {
    name: 'FlexiEditorComponent',
    mounted() {
        this.editor = new FlexiEditor({
            element: this.$refs.editorElement,
            placeholder: 'Start typing...',
            content: '<p>Hello from Vue!</p>'
        });
    },
    beforeUnmount() {
        if (this.editor) {
            this.editor.destroy();
        }
    }
};
</script>
```

## ⚙️ Configuration Options

```javascript
const editor = new FlexiEditor({
    // Required: DOM element to mount the editor
    element: document.getElementById('editor'),
    
    // Optional: Initial content (HTML string)
    content: '<p>Initial content</p>',
    
    // Optional: Placeholder text
    placeholder: 'Start typing...',
    
    // Optional: Make editor read-only
    readOnly: false,
    
    // Optional: Custom theme
    theme: 'default',
    
    // Optional: Custom plugins (array of plugin classes)
    plugins: [MyCustomPlugin],
    
    // Optional: External toolbar element
    toolbar: document.getElementById('custom-toolbar')
});
```

## 📚 API Reference

### Methods

#### `getData()`
Get the current HTML content of the editor.

```javascript
const html = editor.getData();
console.log(html); // '<p>Current content</p>'
```

#### `setData(html)`
Set the HTML content of the editor.

```javascript
editor.setData('<p>New content</p>');
```

#### `execCommand(commandName, ...args)`
Execute a formatting command.

```javascript
editor.execCommand('bold');
editor.execCommand('insertHTML', '<strong>Bold text</strong>');
```

#### `on(event, callback)`
Listen to editor events.

```javascript
editor.on('change', () => {
    console.log('Content changed:', editor.getData());
});

editor.on('focus', () => {
    console.log('Editor focused');
});
```

#### `off(event, callback)`
Remove event listener.

```javascript
const handler = () => console.log('Changed');
editor.on('change', handler);
editor.off('change', handler);
```

#### `destroy()`
Destroy the editor instance and clean up.

```javascript
editor.destroy();
```

### Events

- `ready` - Editor is initialized and ready
- `change` - Content has changed
- `focus` - Editor gained focus
- `blur` - Editor lost focus
- `keydown` - Key pressed
- `keyup` - Key released
- `mouseup` - Mouse button released
- `selection-change` - Text selection changed

## 🎨 Customization

### CSS Variables

Customize the editor appearance using CSS variables:

```css
:root {
    --editor-primary: #2563eb;
    --editor-primary-hover: #1d4ed8;
    --editor-bg: #ffffff;
    --editor-border: #e5e7eb;
    --editor-text: #1f2937;
    --editor-text-light: #6b7280;
    --editor-hover: #f3f4f6;
    --editor-active: #e5e7eb;
    --editor-shadow: rgba(0, 0, 0, 0.1);
    --editor-radius: 6px;
}
```

### Dark Mode Example

```css
[data-theme="dark"] {
    --editor-primary: #3b82f6;
    --editor-primary-hover: #2563eb;
    --editor-bg: #1f2937;
    --editor-border: #374151;
    --editor-text: #f9fafb;
    --editor-text-light: #9ca3af;
    --editor-hover: #374151;
    --editor-active: #4b5563;
    --editor-shadow: rgba(0, 0, 0, 0.3);
}
```

## 🔌 Creating Custom Plugins

```javascript
class MyCustomPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'MyCustomPlugin';
    }

    init() {
        // Register toolbar button
        if (this.editor.toolbar) {
            this.editor.toolbar.registerButton('myButton', {
                title: 'My Custom Button',
                icon: '<svg>...</svg>',
                onAction: (editor) => {
                    // Your custom action
                    editor.execCommand('insertHTML', '<span>Custom!</span>');
                }
            });
        }
    }

    destroy() {
        // Cleanup when editor is destroyed
    }
}

// Use the plugin
const editor = new FlexiEditor({
    element: document.getElementById('editor'),
    plugins: [MyCustomPlugin]
});
```

## 📦 Built-in Plugins

The editor comes with these built-in plugins:

- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Headings**: H1-H6
- **Lists**: Ordered and Unordered lists
- **Alignment**: Left, Center, Right, Justify
- **Links**: Insert and edit links
- **Images**: Upload and insert images
- **Tables**: Create and edit tables
- **Code**: Code blocks and inline code
- **Colors**: Text and background colors
- **Fonts**: Font family and size
- **History**: Undo and Redo
- **Special**: Emojis, special characters, templates
- **Utilities**: Find & Replace, Word Count, Print, Fullscreen

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/flexi-editor/issues)
- 📖 Docs: [Full Documentation](https://github.com/yourusername/flexi-editor)

## 🙏 Acknowledgments

Built with ❤️ using vanilla JavaScript and modern web standards.

---

**Made with ❤️ by Your Name**
