# 🎨 Design Guide - CKEditor-Style Theme

## Color Palette

### Primary Colors
```css
--ck-color-base-active: #1b9af7      /* CKEditor blue */
--ck-color-base-background: #fff     /* White */
--ck-color-base-foreground: #fafafa  /* Light gray */
--ck-color-base-border: #c4c4c4      /* Gray border */
--ck-color-base-text: #333           /* Dark gray text */
```

### Toolbar Colors
```css
--ck-color-toolbar-background: #fafafa  /* Light gray */
--ck-color-toolbar-border: #c4c4c4      /* Gray border */
```

### Button States
```css
Default: transparent
Hover: #e6e6e6
Active: #dedede
Active Hover: #c4c4c4
```

---

## Component Styles

### Toolbar
- **Background**: Light gray (#fafafa)
- **Border**: 1px solid #c4c4c4
- **Padding**: 6px
- **Button Size**: 30x30px
- **Gap**: 2px between buttons

### Buttons
- **Default**: Transparent background
- **Hover**: Light gray (#e6e6e6)
- **Active**: Gray (#dedede)
- **Border**: 1px solid (transparent by default)
- **Border Radius**: 2px
- **Transition**: 0.2s

### Content Area
- **Background**: White (#fff)
- **Padding**: 20px
- **Font Size**: 14px
- **Line Height**: 1.6
- **Min Height**: 200px
- **Max Height**: 500px

### Dialogs
- **Background**: White (#fff)
- **Border**: 1px solid #c4c4c4
- **Border Radius**: 2px
- **Shadow**: 0 8px 16px rgba(0,0,0,0.15)
- **Header Background**: #fafafa
- **Padding**: 12px 16px

---

## Typography

### Font Family
```css
font-family: Helvetica, Arial, Tahoma, Verdana, sans-serif;
```

### Font Sizes
- **Base**: 13px
- **Content**: 14px
- **Small**: 12px
- **Dialog Title**: 14px (bold)

### Headings in Content
- **H1**: 2em, bold
- **H2**: 1.5em, bold
- **H3**: 1.25em, bold

---

## Spacing

### Standard Spacing
- **Small**: 6px
- **Medium**: 12px
- **Large**: 16px
- **Extra Large**: 20px

### Component Spacing
- **Toolbar Padding**: 6px
- **Content Padding**: 20px
- **Dialog Padding**: 12-16px
- **Button Padding**: 8px 16px

---

## Borders & Shadows

### Borders
- **Width**: 1px
- **Color**: #c4c4c4
- **Radius**: 2px (minimal)

### Shadows
- **Toolbar**: None
- **Dialog**: 0 8px 16px rgba(0,0,0,0.15)
- **Focus**: 0 0 0 1px #1b9af7

---

## Interactive States

### Focus
```css
border-color: #1b9af7;
box-shadow: 0 0 0 1px #1b9af7;
```

### Hover
```css
background: #e6e6e6;
```

### Active
```css
background: #dedede;
```

### Disabled
```css
opacity: 0.5;
cursor: not-allowed;
```

---

## Responsive Breakpoints

### Mobile (< 768px)
- Toolbar padding: 4px
- Button size: 28x28px
- Content padding: 12px
- Font size: 16px (content)

### Desktop (>= 768px)
- Toolbar padding: 6px
- Button size: 30x30px
- Content padding: 20px
- Font size: 14px (content)

---

## Customization Examples

### Change Primary Color
```css
:root {
    --ck-color-base-active: #10b981; /* Green */
}
```

### Dark Toolbar
```css
:root {
    --ck-color-toolbar-background: #2d2d2d;
    --ck-color-toolbar-border: #444;
    --ck-color-base-text: #fff;
}
```

### Rounded Corners
```css
:root {
    --ck-border-radius: 6px;
}
```

### Larger Buttons
```css
.editor-toolbar-btn {
    min-width: 36px;
    height: 36px;
}
```

---

## Best Practices

### Do's ✅
- Keep colors minimal and professional
- Use subtle borders (1px)
- Maintain consistent spacing
- Use flat design (no gradients)
- Keep animations subtle (0.2s)

### Don'ts ❌
- Don't use bright colors
- Don't use heavy shadows
- Don't use gradients
- Don't use large border radius
- Don't use slow animations

---

## Comparison with CKEditor

### Similarities
- ✅ Gray toolbar background
- ✅ Flat button design
- ✅ Minimal borders
- ✅ Blue active color
- ✅ Clean typography
- ✅ Professional spacing

### Our Improvements
- ✅ Smaller bundle size
- ✅ Simpler CSS
- ✅ Better performance
- ✅ Easier customization
- ✅ Modern code

---

## CSS Variables Reference

```css
:root {
    /* Backgrounds */
    --ck-color-base-background: #fff;
    --ck-color-base-foreground: #fafafa;
    --ck-color-toolbar-background: #fafafa;
    --ck-color-input-background: #fff;
    --ck-color-panel-background: #fff;
    
    /* Borders */
    --ck-color-base-border: #c4c4c4;
    --ck-color-toolbar-border: #c4c4c4;
    --ck-color-input-border: #c4c4c4;
    --ck-color-panel-border: #c4c4c4;
    
    /* Text */
    --ck-color-base-text: #333;
    
    /* Interactive */
    --ck-color-base-active: #1b9af7;
    --ck-color-button-default-background: transparent;
    --ck-color-button-default-hover-background: #e6e6e6;
    --ck-color-button-on-background: #dedede;
    --ck-color-button-on-hover-background: #c4c4c4;
    
    /* Effects */
    --ck-color-shadow-drop: rgba(0, 0, 0, 0.15);
    --ck-border-radius: 2px;
    --ck-spacing-standard: 0.6em;
}
```

---

## Testing Checklist

### Visual Testing
- [ ] Toolbar looks clean and professional
- [ ] Buttons have proper hover states
- [ ] Dialogs are centered and draggable
- [ ] Content area is clean and readable
- [ ] Colors match CKEditor style

### Functional Testing
- [ ] All buttons work
- [ ] Dialogs open and close
- [ ] Drag and drop works
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

**Design Philosophy**: Clean, Professional, Minimal, Functional
