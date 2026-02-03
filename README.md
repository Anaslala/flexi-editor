# 🚀 Flexi-Editor

[![npm version](https://img.shields.io/npm/v/flexi-editor.svg?style=flat-square)](https://www.npmjs.com/package/flexi-editor)
[![license](https://img.shields.io/npm/l/flexi-editor.svg?style=flat-square)](LICENSE)
[![downloads](https://img.shields.io/npm/dt/flexi-editor.svg?style=flat-square)](https://www.npmjs.com/package/flexi-editor)
[![size](https://img.shields.io/bundlephobia/minzip/flexi-editor?style=flat-square)](https://bundlephobia.com/result?p=flexi-editor)

**The Ultimate Lightweight & Extensible Rich Text Editor for Modern Web Apps.**

Flexi-Editor is a powerful, zero-dependency WYSIWYG editor designed for developers who need full control without the bloat. Built with performance and extensibility in mind, it integrates seamlessly into React, Vue, Angular, or Vanilla JS projects.

---

## ✨ Why Flexi-Editor?

- 🎨 **Premium UI/UX** - sleek, modern design with a dark/light mode adaptable theme.
- ⚡ **Blazing Fast** - < 50KB (gzipped) with zero external runtime dependencies.
- 🔌 **Plugin-First Architecture** - Every feature is a plugin. Customize it exactly how you need.
- 💻 **Developer Friendly** - Strong typing, clear API, and easy integration.
- 🖱️ **Custom Interaction** - Includes a **Custom Right-Click Context Menu** for quick actions.
- 📝 **Advanced Code Blocks** - Syntax highlighting for multiple languages with a clean interface.

## 🌟 Key Features

| Category | Features |
|----------|----------|
| **Core Formatting** | Bold, Italic, Underline, Strikethrough, Sub/Superscript |
| **Structure** | Headings (H1-H6), Lists (Ordered/Unordered), Blockquotes |
| **Rich Media** | Image Uploads (Drag & Drop), Video Embedding, Links |
| **Productivity** | **Custom Context Menu**, Slash Commands (`/`), Floating Toolbar |
| **Layout** | Tables, Dividers, Page Breaks, Alignment, Toggle Blocks |
| **Code** | **Syntax Highlighting** (JS, Python, HTML, CSS, etc.), Line Numbers |
| **Utilities** | Word Count, Reading Time, Find & Replace, Print, Fullscreen |

---

## 📦 Installation

Install via npm or yarn:

```bash
npm install flexi-editor
# or
yarn add flexi-editor
```

Or use via CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/flexi-editor/dist/style.css">
<script src="https://unpkg.com/flexi-editor/dist/flexi-editor.umd.js"></script>
```

---

## 🚀 Quick Start

### Vanilla JavaScript

```javascript
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

const editor = new FlexiEditor({
  element: document.querySelector('#editor'),
  placeholder: 'Type your story here...',
  theme: 'dark', // or 'light' (default)
  onChange: (content) => {
    console.log('Content updated:', content);
  }
});
```

### React Integration

```jsx
import React, { useEffect, useRef } from 'react';
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

const MyEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      new FlexiEditor({
        element: editorRef.current,
        content: '<p>Welcome to <b>Flexi-Editor</b> inside React!</p>'
      });
    }
  }, []);

  return <div ref={editorRef} style={{ minHeight: '300px' }} />;
};

export default MyEditor;
```

---

## 🛠️ Configuration

Flexi-Editor is highly configurable. Pass these options to the constructor:

```javascript
const config = {
  element: HTMLElement,       // Required: The container element
  content: '',                // Initial HTML content
  placeholder: 'Start writing...', 
  readOnly: false,            // Toggle read-only mode
  theme: 'default',           // 'default' (light) or custom
  sanitize: false,            // Disable built-in sanitizer for advanced HTML
  
  // Custom Toolbar Configuration
  toolbar: {
    sticky: true,
    buttons: ['bold', 'italic', 'link', 'image', 'code', 'fullscreen']
  },
  
  // Event Callbacks
  onChange: (html) => {},     // Triggered on every change
  onFocus: () => {},
  onBlur: () => {}
};
```

---

## 🔌 Plugins System

Flexi-Editor is built on a robust plugin system. You can create your own or disable built-in ones.

**Built-in Plugins included:**
`Paragraph`, `Bold`, `Italic`, `Underline`, `List`, `Heading`, `Link`, `Image`, `Table`, `Code`, `ContextMenu`, `SlashCommands`, `FloatingToolbar`, and more.

### Creating a Custom Plugin

```javascript
class MyPlugin {
  constructor(editor) {
    this.editor = editor;
    this.name = 'MyPlugin';
  }

  init() {
    // Add a button to toolbar
    this.editor.toolbar.registerButton('shout', {
      title: 'Shout!',
      icon: '📢',
      onAction: () => this.editor.execCommand('insertHTML', '<h1>HELLO!</h1>')
    });
  }
}

// Usage
new FlexiEditor({
  element: el,
  plugins: [MyPlugin]
});
```

---

## 🎨 Theming

Flexi-Editor uses CSS variables for easy customization. Override them in your CSS:

```css
:root {
  --fe-primary: #3b82f6;       /* Primary Color */
  --fe-bg: #ffffff;            /* Editor Background */
  --fe-text: #1f2937;          /* Text Color */
  --fe-border: #e5e7eb;        /* Border Color */
  --fe-toolbar-bg: #f3f4f6;    /* Toolbar Background */
}

/* Dark Mode Overrides */
[data-theme="dark"] {
  --fe-bg: #1f2937;
  --fe-text: #f3f4f6;
  --fe-toolbar-bg: #111827;
  --fe-border: #374151;
}
```

---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Crafted with ❤️ by Anas Kadival**
