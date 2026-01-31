# Publishing Guide

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **Login to NPM**: Run `npm login` in your terminal
3. **Update package.json**: Change `@yourusername` to your actual NPM username

## Steps to Publish

### 1. Update Package Name

Edit `package.json`:
```json
{
  "name": "flexi-editor",
  ...
}
```

### 2. Build the Package

```bash
npm run build
```

This creates the `dist/` folder with:
- `flexi-editor.es.js` - ES module
- `flexi-editor.umd.js` - UMD module
- `style.css` - Styles

### 3. Test Locally (Optional)

```bash
npm pack
```

This creates a `.tgz` file you can test in another project:

```bash
npm install /path/to/your-package-name-1.0.0.tgz
```

### 4. Publish to NPM

```bash
npm publish --access public
```

For scoped packages (starting with @), you need `--access public` flag.

### 5. Verify Publication

Visit: `https://www.npmjs.com/package/flexi-editor`

## Version Updates

### Patch Release (1.0.0 → 1.0.1)
```bash
npm version patch
npm publish
```

### Minor Release (1.0.0 → 1.1.0)
```bash
npm version minor
npm publish
```

### Major Release (1.0.0 → 2.0.0)
```bash
npm version major
npm publish
```

## Unpublish (Use with Caution)

```bash
npm unpublish flexi-editor@1.0.0
```

**Note**: You can only unpublish within 72 hours of publishing.

## Best Practices

1. **Test before publishing**: Always test your package locally
2. **Update CHANGELOG.md**: Document all changes
3. **Semantic Versioning**: Follow semver (major.minor.patch)
4. **README**: Keep documentation up to date
5. **Git Tags**: Tag releases in git
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add your NPM token to GitHub Secrets as `NPM_TOKEN`.

## Troubleshooting

### Error: Package name already exists
- Choose a different name or use a scoped package (@username/package-name)

### Error: You must be logged in
- Run `npm login` and enter your credentials

### Error: 403 Forbidden
- Check if package name is available
- Ensure you have publish rights
- Use `--access public` for scoped packages

## Support

For issues, visit: https://docs.npmjs.com/
