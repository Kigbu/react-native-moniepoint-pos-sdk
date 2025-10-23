# Publishing Guide for react-native-moniepoint-pos-sdk

This guide will help you publish your library to NPM so other developers can install it.

## 📋 Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All code is tested and working
- [ ] README.md is complete with examples
- [ ] package.json has correct information
- [ ] Git repository is initialized and pushed
- [ ] You have an NPM account
- [ ] Version number follows semantic versioning

## 🚀 Publishing Steps

### Step 1: Create NPM Account (if you don't have one)

```bash
# Sign up at https://www.npmjs.com/signup
# Then login from terminal
npm login
```

Enter your:

- Username
- Password
- Email

### Step 2: Update Package Information

Edit `package.json` and update:

```json
{
  "name": "react-native-moniepoint-pos-sdk",
  "version": "1.0.0",
  "description": "React Native wrapper for Moniepoint POS SDK",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/react-native-moniepoint-pos-sdk.git"
  }
}
```

### Step 3: Test Locally First

```bash
# In the library directory
npm pack

# This creates: react-native-moniepoint-pos-sdk-1.0.0.tgz
```

Test installation in your app:

```bash
# In your app directory
npm install /path/to/react-native-moniepoint-pos-sdk-1.0.0.tgz
```

### Step 4: Push to GitHub

```bash
# Create a new repository on GitHub first
# Then:
git remote add origin https://github.com/YOUR_USERNAME/react-native-moniepoint-pos-sdk.git
git branch -M main
git push -u origin main
```

### Step 5: Publish to NPM

```bash
# Make sure you're in the library directory
cd /Users/valuepay/Documents/sotfware/itech/react-native-moniepoint-pos-sdk

# Publish
npm publish --access public
```

> **Note:** For scoped packages (e.g., `@yourorg/react-native-moniepoint-pos-sdk`), you need `--access public` flag.

## 🎉 Success!

Your package is now published! Others can install it with:

```bash
npm install react-native-moniepoint-pos-sdk
```

## 📦 Managing Updates

### Patch Release (Bug fixes: 1.0.0 → 1.0.1)

```bash
# Fix bugs, then:
npm version patch
git push && git push --tags
npm publish
```

### Minor Release (New features: 1.0.0 → 1.1.0)

```bash
# Add new features, then:
npm version minor
git push && git push --tags
npm publish
```

### Major Release (Breaking changes: 1.0.0 → 2.0.0)

```bash
# Make breaking changes, then:
npm version major
git push && git push --tags
npm publish
```

## 🔐 Private Publishing (Optional)

If you want to keep it private:

### Option 1: NPM Private Packages

```bash
npm publish  # Defaults to private for scoped packages
```

### Option 2: GitHub Packages

Edit `package.json`:

```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

Then:

```bash
npm publish
```

### Option 3: Private NPM Registry

```bash
npm publish --registry https://your-private-registry.com
```

## 🏷️ Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes

  - API changes that break existing code
  - Removed features
  - Changed behavior

- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)

  - New methods or features
  - Deprecation notices
  - Performance improvements

- **PATCH** (1.0.0 → 1.0.1): Bug fixes
  - Bug fixes
  - Documentation updates
  - Internal improvements

## 📝 Best Practices

### 1. Update CHANGELOG.md

Before each release, update `CHANGELOG.md`:

```markdown
## [1.0.1] - 2025-01-XX

### Fixed

- Fixed QR code printing issue
- Improved error handling for card payments

### Changed

- Updated documentation with more examples
```

### 2. Tag Releases

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 3. Create GitHub Releases

1. Go to your GitHub repository
2. Click "Releases"
3. Click "Create a new release"
4. Select your tag
5. Add release notes from CHANGELOG.md

### 4. Test Before Publishing

Always test in a real project before publishing:

```bash
# Test installation
npm pack
npm install ../react-native-moniepoint-pos-sdk-1.0.0.tgz

# Test building
npm run android

# Test functionality
# Run your app and test all features
```

## 🔄 Unpublishing (Emergency Only)

If you need to remove a version (use sparingly!):

```bash
# Unpublish a specific version
npm unpublish react-native-moniepoint-pos-sdk@1.0.0

# Unpublish entire package (within 72 hours of publishing)
npm unpublish react-native-moniepoint-pos-sdk --force
```

> ⚠️ **Warning:** Unpublishing is permanent and can break projects depending on your package!

## 📊 Package Statistics

After publishing, monitor your package:

- **NPM Page**: https://www.npmjs.com/package/react-native-moniepoint-pos-sdk
- **Download Stats**: https://npm-stat.com/charts.html?package=react-native-moniepoint-pos-sdk
- **Bundle Size**: https://bundlephobia.com/package/react-native-moniepoint-pos-sdk

## 🛡️ Security

### Protect Your Credentials

1. **Never commit `gradle.properties`** with real credentials
2. Use environment variables for CI/CD:

```bash
# .github/workflows/publish.yml
env:
  MONIEPOINT_USERNAME: ${{ secrets.MONIEPOINT_USERNAME }}
  MONIEPOINT_PASSWORD: ${{ secrets.MONIEPOINT_PASSWORD }}
```

### Enable 2FA on NPM

```bash
npm profile enable-2fa auth-and-writes
```

## 📞 Support

After publishing, be prepared to:

- Monitor GitHub issues
- Respond to questions
- Fix bugs promptly
- Keep dependencies updated

## ✅ Post-Publishing Checklist

After publishing:

- [ ] Verify package appears on NPM
- [ ] Test installation from NPM: `npm install react-native-moniepoint-pos-sdk`
- [ ] Update your app to use the NPM version
- [ ] Share on social media/forums
- [ ] Add NPM badge to README.md:

```markdown
[![npm version](https://badge.fury.io/js/react-native-moniepoint-pos-sdk.svg)](https://badge.fury.io/js/react-native-moniepoint-pos-sdk)
[![npm downloads](https://img.shields.io/npm/dm/react-native-moniepoint-pos-sdk.svg)](https://www.npmjs.com/package/react-native-moniepoint-pos-sdk)
```

---

**Congratulations on publishing your package! 🎉**

For questions, open an issue on GitHub or contact the community.

