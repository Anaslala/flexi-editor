# Flexi Editor - New Features Documentation

## Overview

Three powerful new features have been added to Flexi Editor to enhance usability and reliability:

1. **Auto Save + Draft Recovery** - Never lose your work
2. **Smart Paste** - Clean formatting from Word/Docs
3. **Image Upload** - Upload images with drag-drop support

All features are **ADDITIVE** - existing functionality remains unchanged. Features are optional and can be enabled/disabled via configuration.

---

## 🚀 Quick Start

### Enable All Features

```javascript
import FlexiEditor from 'flexi-editor';

const editor = new FlexiEditor({
  element: document.getElementById('editor'),
  preset: 'full', // Includes all new features
  autoSave: {
    enabled: true,
    interval: 2000
  },
  smartPaste: {
    enabled: true
  },
  imageUpload: {
    enabled: true
  }
});
```

### Disable Features

```javascript
const editor = new FlexiEditor({
  element: document.getElementById('editor'),
  autoSave: { enabled: false },
  smartPaste: { enabled: false },
  imageUpload: { enabled: false }
});
```

---

## 💾 Feature 1: Auto Save + Draft Recovery

### Description

Automatically saves editor content using custom adapters and provides draft recovery when the page is reloaded. **Note:** This plugin requires you to provide your own save/load adapters to integrate with your backend/database.

### Features

- ✅ Debounced auto-save (configurable interval)
- ✅ Draft recovery prompt on page load
- ✅ Custom save/load adapters (integrate with your DB)
- ✅ Multiple editor instance support
- ✅ Graceful error handling

### Configuration

```javascript
{
  autoSave: {
    enabled: true,              // Enable/disable auto-save
    interval: 2000,             // Debounce interval in ms (default: 2000)
    saveAdapter: async (data) => {
      // Save to your database
      // data = { content, timestamp, editorId }
      await fetch('/api/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    },
    loadAdapter: async () => {
      // Load from your database
      const response = await fetch('/api/load-draft');
      const data = await response.json();
      return data; // { content, timestamp }
    },
    clearAdapter: async () => {
      // Clear draft from your database
      await fetch('/api/clear-draft', { method: 'DELETE' });
    }
  }
}
```

### Usage Examples

#### Basic Usage

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  autoSave: {
    enabled: true,
    interval: 3000 // Save after 3 seconds of inactivity
  }
});
```

#### Custom Storage Key

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  autoSave: {
    enabled: true,
    key: 'my-app-draft' // Custom key for your app
  }
});
```

#### Listen to Auto-Save Events

```javascript
editor.on('autosave', (data) => {
  console.log('Content saved:', data);
  // Show notification to user
  showNotification('Draft saved');
});
```

#### Manual Save

```javascript
const autoSavePlugin = editor.plugins.get('AutoSave');
autoSavePlugin.save(); // Manually trigger save
```

#### Clear Draft

```javascript
const autoSavePlugin = editor.plugins.get('AutoSave');
autoSavePlugin.clearDraft(); // Clear saved draft
```

### How It Works

1. **Auto-Save**: Content is automatically saved to storage after the configured interval of inactivity
2. **Draft Detection**: On page load, checks for existing draft
3. **Recovery Prompt**: If draft found, shows banner with "Restore" and "Discard" options
4. **Restore**: Loads saved content into editor
5. **Discard**: Clears saved draft and starts fresh

### UI Elements

The draft recovery banner appears at the top of the editor:

```
💾 Draft found from 5 minutes ago. Would you like to restore it?
[Restore Draft] [Discard]
```

---

## 📋 Feature 2: Smart Paste

### Description

Intelligently cleans pasted content from Microsoft Word and Google Docs while preserving semantic formatting.

### Features

- ✅ Removes inline styles
- ✅ Removes Word-specific markup (mso-*, <o:p>, <w:*>)
- ✅ Preserves headings (h1-h6)
- ✅ Preserves lists (ul, ol, li)
- ✅ Preserves bold, italic, links
- ✅ Configurable cleaning rules
- ✅ Fallback to plain text on error

### Configuration

```javascript
{
  smartPaste: {
    enabled: true,           // Enable/disable smart paste
    mode: 'clean',           // 'clean' | 'plain' | 'preserve'
    preserveTags: [          // Tags to preserve (default shown)
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br',
      'ul', 'ol', 'li',
      'strong', 'b', 'em', 'i',
      'a', 'code', 'pre',
      'blockquote'
    ],
    removeAttributes: [      // Attributes to remove (default shown)
      'style', 'class', 'id', 'lang', 'dir', 'align'
    ]
  }
}
```

### Usage Examples

#### Basic Usage (Clean Mode)

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  smartPaste: {
    enabled: true,
    mode: 'clean' // Clean HTML while preserving semantic tags
  }
});
```

#### Plain Text Mode

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  smartPaste: {
    enabled: true,
    mode: 'plain' // Always paste as plain text
  }
});
```

#### Preserve Mode

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  smartPaste: {
    enabled: true,
    mode: 'preserve' // Don't clean, paste as-is
  }
});
```

#### Custom Preserve Tags

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  smartPaste: {
    enabled: true,
    preserveTags: ['h1', 'h2', 'p', 'strong', 'em', 'a'] // Only these tags
  }
});
```

### Cleaning Rules

#### What Gets Removed

- ❌ Inline `style` attributes
- ❌ Word-specific tags (`<o:p>`, `<w:*>`, `<m:*>`)
- ❌ mso-* attributes
- ❌ Word comments (`<!--[if ...]>`)
- ❌ Font tags
- ❌ Unnecessary spans and divs
- ❌ Class and ID attributes

#### What Gets Preserved

- ✅ Headings (h1-h6)
- ✅ Paragraphs (p)
- ✅ Lists (ul, ol, li)
- ✅ Bold (strong, b)
- ✅ Italic (em, i)
- ✅ Links (a with href)
- ✅ Code blocks (code, pre)
- ✅ Blockquotes

### Example Transformation

**Before (Word HTML):**
```html
<p class="MsoNormal" style="margin-left:20px;color:red;font-family:Arial;">
  <span style="mso-style-name:'Heading 1';">
    This is a <strong style="color:blue;">heading</strong>
  </span>
</p>
```

**After (Cleaned):**
```html
<p>This is a <strong>heading</strong></p>
```

---

## 📸 Feature 3: Image Upload

### Description

Enhances the existing ImagePlugin with file upload, drag-drop support, and custom upload adapter interface.

### Features

- ✅ File picker upload
- ✅ Drag and drop support
- ✅ Upload progress indicator
- ✅ Custom upload adapter
- ✅ File validation (type and size)
- ✅ Error handling with user feedback
- ✅ Base64 encoding (default)
- ✅ Preserves existing URL-based image insertion

### Configuration

```javascript
{
  imageUpload: {
    enabled: true,
    maxSize: 5 * 1024 * 1024,  // 5MB (default)
    allowedTypes: [             // Allowed MIME types
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ],
    adapter: async (file) => {
      // Default: base64 encoding
      // Custom: upload to server
      return { url: 'image-url' };
    }
  }
}
```

### Usage Examples

#### Basic Usage (Base64 Default)

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  imageUpload: {
    enabled: true,
    maxSize: 5 * 1024 * 1024 // 5MB limit
  }
});
```

#### Custom Upload Adapter (Server Upload)

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  imageUpload: {
    enabled: true,
    adapter: async (file) => {
      // Upload to your server
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      // Return URL
      return { url: data.imageUrl };
    }
  }
});
```

#### Custom Upload with Progress

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  imageUpload: {
    enabled: true,
    adapter: async (file) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            console.log(`Upload progress: ${percent}%`);
          }
        });
        
        xhr.addEventListener('load', () => {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.imageUrl });
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });
        
        const formData = new FormData();
        formData.append('image', file);
        
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    }
  }
});
```

#### Cloud Storage Upload (AWS S3 Example)

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  imageUpload: {
    enabled: true,
    adapter: async (file) => {
      // Get presigned URL from your backend
      const presignedResponse = await fetch('/api/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });
      
      const { uploadUrl, imageUrl } = await presignedResponse.json();
      
      // Upload directly to S3
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });
      
      // Return public URL
      return { url: imageUrl };
    }
  }
});
```

### How It Works

#### File Picker Upload

1. Click the Image button in toolbar
2. Switch to "Upload File" tab
3. Select image file
4. File is validated (type and size)
5. Upload adapter is called
6. Progress indicator shows
7. Image is inserted at cursor position

#### Drag and Drop

1. Drag image file from computer
2. Drop zone indicator appears
3. Drop file into editor
4. File is validated
5. Upload adapter is called
6. Image is inserted at drop location

### UI Elements

#### Upload Dialog

The enhanced image dialog has two tabs:
- **From URL**: Original URL-based insertion (preserved)
- **Upload File**: New file upload option

#### Progress Indicator

During upload, a spinner overlay appears:
```
🔄 Uploading image...
```

#### Error Messages

If upload fails, an error notification appears:
```
⚠️ File size exceeds 5MB limit
[Dismiss]
```

### File Validation

The plugin validates files before upload:

- **Type Check**: Only allowed MIME types accepted
- **Size Check**: Files must be under maxSize limit
- **Error Messages**: User-friendly validation errors

---

## 🔧 Advanced Configuration

### Disable Features Selectively

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  preset: 'full',
  autoSave: { enabled: false },    // Disable auto-save
  smartPaste: { enabled: true },   // Enable smart paste
  imageUpload: { enabled: true }   // Enable image upload
});
```

### Multiple Editor Instances

Each editor instance has its own auto-save storage:

```javascript
const editor1 = new FlexiEditor({
  element: '#editor1',
  autoSave: { key: 'editor-1-draft' }
});

const editor2 = new FlexiEditor({
  element: '#editor2',
  autoSave: { key: 'editor-2-draft' }
});
```

### Session Storage (Temporary Drafts)

```javascript
const editor = new FlexiEditor({
  element: '#editor',
  autoSave: {
    enabled: true,
    storageType: 'sessionStorage' // Cleared when tab closes
  }
});
```

---

## 🧪 Testing

### Test Auto Save

1. Type content in editor
2. Wait 2 seconds (or configured interval)
3. Check browser console for "Content auto-saved" message
4. Reload page
5. Draft recovery prompt should appear
6. Click "Restore Draft" to load saved content

### Test Smart Paste

1. Copy content from Microsoft Word or Google Docs
2. Paste into editor
3. Inline styles should be removed
4. Semantic formatting (headings, lists, bold, italic) should be preserved

### Test Image Upload

**File Picker:**
1. Click Image button in toolbar
2. Switch to "Upload File" tab
3. Select an image file
4. Image should be uploaded and inserted

**Drag and Drop:**
1. Drag an image file from your computer
2. Drop it into the editor
3. Drop zone indicator should appear during drag
4. Image should be uploaded and inserted

---

## 📊 Browser Compatibility

All features work in modern browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### localStorage Support

Auto-save requires localStorage support. The plugin gracefully handles:
- localStorage not available
- Quota exceeded errors
- Private browsing mode

---

## 🐛 Troubleshooting

### Auto Save Not Working

**Problem**: Content not being saved

**Solutions**:
- Check if `autoSave.enabled` is `true`
- Verify localStorage is available in browser
- Check browser console for errors
- Try clearing localStorage: `localStorage.clear()`

### Smart Paste Not Cleaning

**Problem**: Pasted content still has formatting

**Solutions**:
- Check if `smartPaste.enabled` is `true`
- Verify `mode` is set to `'clean'` (not `'preserve'`)
- Try pasting as plain text (Ctrl+Shift+V)
- Check browser console for errors

### Image Upload Failing

**Problem**: Images not uploading

**Solutions**:
- Check if `imageUpload.enabled` is `true`
- Verify file size is under `maxSize` limit
- Check file type is in `allowedTypes` array
- Verify custom adapter returns `{ url: '...' }`
- Check browser console for errors
- Test with default base64 adapter first

---

## 🔒 Security Considerations

### Auto Save

- localStorage is origin-bound (secure)
- No sensitive data exposure risk
- Users can clear drafts manually

### Smart Paste

- HTML sanitization prevents XSS
- Removes script tags and event handlers
- Whitelist approach for allowed tags
- Safe for user-generated content

### Image Upload

- File type validation prevents malicious files
- File size limits prevent abuse
- Custom adapter allows server-side validation
- Base64 encoding is safe for client-side
- Always validate uploads on server-side

---

## 📚 API Reference

### AutoSavePlugin

```javascript
const autoSave = editor.plugins.get('AutoSave');

// Methods
autoSave.save();           // Manually trigger save
autoSave.clearDraft();     // Clear saved draft
autoSave.loadDraft();      // Load draft data
autoSave.startAutoSave();  // Start auto-save
autoSave.stopAutoSave();   // Stop auto-save

// Events
editor.on('autosave', (data) => {
  console.log('Saved:', data);
});
```

### SmartPastePlugin

```javascript
const smartPaste = editor.plugins.get('SmartPaste');

// Configuration only - no public methods
// Paste handling is automatic
```

### ImageUploadPlugin

```javascript
const imageUpload = editor.plugins.get('ImageUpload');

// Methods
imageUpload.handleFileUpload(file, alt);  // Manually upload file
imageUpload.validateFile(file);           // Validate file

// No events - uses existing image insertion
```

---

## 🎯 Best Practices

### Auto Save

1. **Set appropriate interval**: 2-3 seconds is recommended
2. **Use unique keys**: For multiple editors on same page
3. **Clear drafts**: When user explicitly saves or publishes
4. **Show feedback**: Listen to `autosave` event and notify user

### Smart Paste

1. **Test with real content**: Copy from Word/Docs and test
2. **Customize preserve tags**: Based on your needs
3. **Provide plain text option**: For users who want no formatting
4. **Document behavior**: Let users know paste is being cleaned

### Image Upload

1. **Implement server upload**: Don't rely on base64 for production
2. **Validate on server**: Always validate file type and size server-side
3. **Use CDN**: Store uploaded images on CDN for performance
4. **Handle errors**: Provide clear error messages to users
5. **Show progress**: For large files, show upload progress

---

## 📝 Migration Guide

### From Previous Version

No migration needed! All features are additive and backward compatible.

**Existing code continues to work:**
```javascript
// This still works exactly as before
const editor = new FlexiEditor({
  element: '#editor',
  preset: 'full'
});
```

**To enable new features:**
```javascript
// Just add configuration
const editor = new FlexiEditor({
  element: '#editor',
  preset: 'full',
  autoSave: { enabled: true },
  smartPaste: { enabled: true },
  imageUpload: { enabled: true }
});
```

---

## 🤝 Contributing

Found a bug or have a feature request? Please open an issue on GitHub.

---

## 📄 License

Same license as Flexi Editor core.

---

## 🎉 Changelog

### Version 1.1.0 (Current)

**Added:**
- ✨ Auto Save + Draft Recovery plugin
- ✨ Smart Paste plugin
- ✨ Image Upload plugin

**Changed:**
- None (all changes are additive)

**Fixed:**
- None

**Breaking Changes:**
- None (100% backward compatible)
