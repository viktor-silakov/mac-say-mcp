# Release Process

This document describes how to release new versions of mac-say-mcp.

## Prerequisites

1. Make sure you have push access to the repository
2. Make sure you have npm publish access to the package
3. All changes should be committed and pushed to main branch
4. Working directory should be clean

## Release Types

### Patch Release (1.0.0 → 1.0.1)
For bug fixes and minor improvements:
```bash
npm run release:patch
```

### Minor Release (1.0.0 → 1.1.0)  
For new features that don't break existing functionality:
```bash
npm run release:minor
```

### Major Release (1.0.0 → 2.0.0)
For breaking changes:
```bash
npm run release:major
```

### Beta Release (1.0.0 → 1.0.1-beta.0)
For pre-releases:
```bash
npm run release:beta
```

## Dry Run

To see what would happen without actually releasing:
```bash
npm run release:dry
```

## What Happens During Release

1. **TypeScript Check**: Runs `npm run typecheck` to verify TypeScript compilation
2. **Build**: Runs `npm run build` to create distribution files
3. **Version Bump**: Updates version in package.json
4. **Changelog**: Updates CHANGELOG.md with conventional commits
5. **Git Commit**: Creates release commit with conventional message
6. **Git Tag**: Creates git tag for the version
7. **GitHub Release**: Creates GitHub release with auto-generated notes
8. **NPM Publish**: Publishes package to npm registry

## Commit Message Format

Use conventional commit format for automatic changelog generation:

- `feat:` for new features
- `fix:` for bug fixes  
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add new TTS voice filtering options
fix: resolve audio file generation bug  
docs: update README with installation instructions
```

## Manual Release Steps (if automated process fails)

1. Build the project:
   ```bash
   npm run build
   ```

2. Update version manually:
   ```bash
   npm version patch|minor|major
   ```

3. Push changes and tags:
   ```bash
   git push origin main --tags
   ```

4. Publish to npm:
   ```bash
   npm publish
   ```

5. Create GitHub release manually through the web interface

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run typecheck`
- Verify all dependencies are installed: `npm install`
- Check for syntax errors in source files

### Git Issues
- Make sure working directory is clean
- Verify you're on the main branch
- Check remote repository access

### NPM Publish Issues
- Verify you're logged in: `npm whoami`
- Check package name availability
- Verify npm access permissions

### GitHub Release Issues
- Check GitHub token permissions
- Verify repository access
- Make sure remote origin is correct

## Configuration Files

- `.release-it.json`: Main release-it configuration
- `package.json`: npm scripts and metadata  
- `CHANGELOG.md`: Auto-generated changelog
- `.npmignore`: Files to exclude from npm package

## Post-Release Checklist

- [ ] Verify npm package was published successfully
- [ ] Check GitHub release was created
- [ ] Verify CHANGELOG.md was updated
- [ ] Test installation from npm: `npm install -g mac-say-mcp`
- [ ] Update any dependent projects or documentation