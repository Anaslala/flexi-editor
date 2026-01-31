# 📦 NPM Package Complete Guide

## Package Information

**Package Name**: `flexi-editor`  
**Version**: 1.0.0  
**Size**: 
- ES Module: 94 KB (20 KB gzipped)
- UMD Module: 60 KB (16 KB gzipped)
- CSS: 7.6 KB (1.8 KB gzipped)

**Total Bundle Size**: ~60 KB minified + gzipped

---

## 📥 Installation

### NPM
```bash
npm install flexi-editor
```

### Yarn
```bash
yarn add flexi-editor
```

### PNPM
```bash
pnpm add flexi-editor
```

### CDN (No Build Required)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/flexi-editor/dist/style.css">

<!-- JavaScript -->
<script src="https://unpkg.com/flexi-editor/dist/flexi-editor.umd.js"></script>
```

---

## 🚀 Usage

### 1. Vanilla JavaScript (ES Modules)

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

        // Get content
        console.log(editor.getData());

        // Listen to changes
        editor.on('change', () => {
            console.log('Content changed:', editor.getData());
        });
    </script>
</body>
</html>
```

### 2. With Module Bundler (Webpack, Vite, Parcel)

```javascript
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

const editor = new FlexiEditor({
    element: document.getElementById('editor'),
    placeholder: 'Start typing...'
});
```

### 3. React Component

```jsx
import { useEffect, useRef } from 'react';
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

function FlexiEditorComponent({ initialContent = '', onChange }) {
    const editorRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !instanceRef.current) {
            instanceRef.current = new FlexiEditor({
                element: editorRef.current,
                placeholder: 'Start typing...',
                content: initialContent
            });

            instanceRef.current.on('change', () => {
                if (onChange) {
                    onChange(instanceRef.current.getData());
                }
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

### 4. Vue 3 Component

```vue
<template>
    <div ref="editorElement"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

const editorElement = ref(null);
let editor = null;

const emit = defineEmits(['change']);

onMounted(() => {
    editor = new FlexiEditor({
        element: editorElement.value,
        placeholder: 'Start typing...'
    });

    editor.on('change', () => {
        emit('change', editor.getData());
    });
});

onBeforeUnmount(() => {
    if (editor) {
        editor.destroy();
    }
});
</script>
```

### 5. Angular Component

```typescript
import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import FlexiEditor from 'flexi-editor';

@Component({
    selector: 'app-editor',
    template: '<div #editorElement></div>',
    styles: [`@import 'flexi-editor/style.css';`]
})
export class EditorComponent implements OnInit, OnDestroy {
    @ViewChild('editorElement') editorElement!: ElementRef;
    private editor: any;

    ngOnInit() {
        this.editor = new FlexiEditor({
            element: this.editorElement.nativeElement,
            placeholder: 'Start typing...'
        });
    }

    ngOnDestroy() {
        if (this.editor) {
            this.editor.destroy();
        }
    }

    getContent() {
        return this.editor.getData();
    }
}
```

---

## ⚙️ Configuration Options

```javascript
const editor = new FlexiEditor({
    // Required: DOM element to mount editor
    element: document.getElementById('editor'),
    
    // Optional: Initial HTML content
    content: '<p>Initial content</p>',
    
    // Optional: Placeholder text when empty
    placeholder: 'Start typing...',
    
    // Optional: Make editor read-only
    readOnly: false,
    
    // Optional: Theme name
    theme: 'default',
    
    // Optional: Custom plugins array
    plugins: [MyCustomPlugin],
    
    // Optional: External toolbar element
    toolbar: document.getElementById('custom-toolbar')
});
```

---

## 📚 API Reference

### Methods

#### `getData()`
Returns the current HTML content.
```javascript
const html = editor.getData();
```

#### `setData(html)`
Sets the HTML content.
```javascript
editor.setData('<p>New content</p>');
```

#### `execCommand(command, ...args)`
Executes a formatting command.
```javascript
editor.execCommand('bold');
editor.execCommand('insertHTML', '<strong>Text</strong>');
```

#### `on(event, callback)`
Adds an event listener.
```javascript
editor.on('change', () => {
    console.log('Content changed');
});
```

#### `off(event, callback)`
Removes an event listener.
```javascript
const handler = () => console.log('Changed');
editor.on('change', handler);
editor.off('change', handler);
```

#### `destroy()`
Destroys the editor and cleans up.
```javascript
editor.destroy();
```

### Events

- `ready` - Editor initialized
- `change` - Content changed
- `focus` - Editor focused
- `blur` - Editor blurred
- `keydown` - Key pressed
- `keyup` - Key released
- `mouseup` - Mouse released
- `selection-change` - Selection changed

---

## 🎨 Customization

### CSS Variables

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

### Dark Mode

```css
[data-theme="dark"] {
    --editor-primary: #3b82f6;
    --editor-bg: #1f2937;
    --editor-border: #374151;
    --editor-text: #f9fafb;
    --editor-text-light: #9ca3af;
    --editor-hover: #374151;
    --editor-active: #4b5563;
}
```

---

## 🔌 Built-in Features

### Text Formatting
- Bold, Italic, Underline, Strikethrough
- Subscript, Superscript
- Text color, Background color
- Font family, Font size

### Structure
- Headings (H1-H6)
- Paragraphs
- Ordered lists
- Unordered lists
- Blockquotes

### Alignment
- Left, Center, Right, Justify
- Indent, Outdent

### Media
- Images (upload & URL)
- Videos (embed)
- Links

### Advanced
- Tables
- Code blocks
- Special characters
- Emojis
- Templates

### Utilities
- Undo/Redo
- Find & Replace
- Word count
- Clear formatting
- Source view
- Fullscreen
- Print

---

## 📦 Package Structure

```
flexi-editor/
├── dist/
│   ├── flexi-editor.es.js      # ES Module (94 KB)
│   ├── flexi-editor.umd.js     # UMD Module (60 KB)
│   └── style.css         # Styles (7.6 KB)
├── README.md
├── LICENSE
└── package.json
```

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 📝 Publishing Your Own Version

### 1. Update package.json
```json
{
  "name": "flexi-editor",
  "version": "1.0.0"
}
```

### 2. Build
```bash
npm run build
```

### 3. Login to NPM
```bash
npm login
```

### 4. Publish
```bash
npm publish --access public
```

### 5. Update Version
```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
npm publish
```

---

## 🔧 Development

### Setup
```bash
git clone https://github.com/yourusername/flexi-editor
cd flexi-editor
npm install
```

### Dev Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

---

## 📄 License

MIT License - Free to use in personal and commercial projects.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

- 📖 [Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/yourusername/flexi-editor/issues)
- 💬 [Discussions](https://github.com/yourusername/flexi-editor/discussions)
- 📧 Email: support@example.com

---

## ⭐ Show Your Support

If you find this package useful, please:
- ⭐ Star the repository
- 🐦 Share on Twitter
- 📝 Write a blog post
- 💬 Tell your friends

---

**Made with ❤️ for the developer community**
