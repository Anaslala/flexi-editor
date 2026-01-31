# Usage Guide

## Installation

```bash
npm install flexi-editor
```

## Basic Setup

### HTML + JavaScript

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
            placeholder: 'Start typing...'
        });
    </script>
</body>
</html>
```

### With CDN

```html
<link rel="stylesheet" href="https://unpkg.com/flexi-editor/dist/style.css">
<script src="https://unpkg.com/flexi-editor/dist/flexi-editor.umd.js"></script>

<div id="editor"></div>

<script>
    const editor = new FlexiEditor.default({
        element: document.getElementById('editor')
    });
</script>
```

## Configuration

```javascript
const editor = new FlexiEditor({
    // Required
    element: document.getElementById('editor'),
    
    // Optional
    content: '<p>Initial content</p>',
    placeholder: 'Type here...',
    readOnly: false,
    theme: 'default',
    plugins: [],
    toolbar: null // or custom toolbar element
});
```

## API Methods

### Get Content
```javascript
const html = editor.getData();
console.log(html);
```

### Set Content
```javascript
editor.setData('<p>New content</p>');
```

### Execute Commands
```javascript
editor.execCommand('bold');
editor.execCommand('insertHTML', '<strong>Bold</strong>');
```

### Event Listeners
```javascript
editor.on('change', () => {
    console.log('Content changed');
});

editor.on('focus', () => {
    console.log('Editor focused');
});

editor.on('blur', () => {
    console.log('Editor blurred');
});
```

### Destroy Editor
```javascript
editor.destroy();
```

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

function MyEditor() {
    const editorRef = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !instanceRef.current) {
            instanceRef.current = new FlexiEditor({
                element: editorRef.current,
                placeholder: 'Start typing...'
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
```

### Vue 3

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

onMounted(() => {
    editor = new FlexiEditor({
        element: editorElement.value,
        placeholder: 'Start typing...'
    });
});

onBeforeUnmount(() => {
    if (editor) {
        editor.destroy();
    }
});
</script>
```

### Angular

```typescript
import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import FlexiEditor from 'flexi-editor';
import 'flexi-editor/style.css';

@Component({
    selector: 'app-editor',
    template: '<div #editorElement></div>'
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
}
```

## Customization

### Custom Theme

```css
:root {
    --editor-primary: #10b981;
    --editor-primary-hover: #059669;
    --editor-bg: #ffffff;
    --editor-border: #e5e7eb;
    --editor-text: #1f2937;
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

## Custom Plugins

```javascript
class MyPlugin {
    constructor(editor) {
        this.editor = editor;
        this.name = 'MyPlugin';
    }

    init() {
        this.editor.toolbar.registerButton('myButton', {
            title: 'My Button',
            icon: '<svg>...</svg>',
            onAction: (editor) => {
                editor.execCommand('insertHTML', '<span>Custom!</span>');
            }
        });
    }

    destroy() {
        // Cleanup
    }
}

const editor = new FlexiEditor({
    element: document.getElementById('editor'),
    plugins: [MyPlugin]
});
```

## Examples

See the `examples/` folder for complete working examples:
- `vanilla-js.html` - Pure JavaScript
- `react-example.jsx` - React component
- `vue-example.vue` - Vue component

## Troubleshooting

### Styles not loading
Make sure to import the CSS:
```javascript
import 'flexi-editor/style.css';
```

### Editor not initializing
Check that the element exists before creating the editor:
```javascript
const element = document.getElementById('editor');
if (element) {
    const editor = new FlexiEditor({ element });
}
```

### Content not saving
Listen to the change event:
```javascript
editor.on('change', () => {
    const content = editor.getData();
    // Save to backend
});
```
