# Mac Say MCP - TypeScript Edition

MCP Server for text-to-speech using macOS `say` command, written in TypeScript and built with esbuild.

## Features

- 🎵 **Text-to-Speech**: Convert text to speech instantly
- 🔊 **Audio File Generation**: Save TTS as AIFF, WAV, or MP4 files  
- 🗣️ **Voice Management**: List and demo system voices
- ⚙️ **System Info**: Get TTS capabilities and configuration
- 🚀 **TypeScript**: Full type safety and modern development experience
- 📦 **Fast Build**: Lightning-fast builds with esbuild

## Quick Start

### Installation

#### Local Development
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

#### Global Installation
```bash
# Install globally from npm (when published)
npm install -g mac-say-mcp

# Or install from local directory
npm install -g .

# Use directly
mac-say-mcp
```

#### NPM Package Installation

For MCP clients, you can use the npm package directly with `npx`:

```json
{
  "mcpServers": {
    "mac-say-mcp": {
      "command": "npx",
      "args": ["-y", "mac-say-mcp@latest"],
      "env": {
        "TTS_DEFAULT_VOICE": "Alex",
        "TTS_DEFAULT_RATE": "200"
      }
    }
  }
}
```

This approach:
- ✅ Always uses the latest published version
- ✅ No need for local builds or global installation
- ✅ Automatic package installation with `-y` flag
- ✅ Perfect for CI/CD and shared configurations

### Development

```bash
# Type checking
npm run typecheck

# Build in watch mode
npm run build:watch

# Development mode (watch + restart)
npm run dev
```

## Available Scripts

- `npm run build` - Build the TypeScript code with esbuild
- `npm run build:watch` - Build in watch mode for development
- `npm run start` - Build and start the MCP server
- `npm run dev` - Development mode with auto-rebuild
- `npm run clean` - Clean build artifacts
- `npm run typecheck` - Run TypeScript type checking
- `npm run prod` - Production build with minification

## MCP Tools

### 1. `tts_speak`
Convert text to speech and play immediately:

```json
{
  "name": "tts_speak",
  "arguments": {
    "text": "Hello, world!",
    "voice": "Alex",
    "rate": 200
  }
}
```

### 2. `tts_save_audio`
Save text-to-speech as audio file:

```json
{
  "name": "tts_save_audio", 
  "arguments": {
    "text": "Hello, world!",
    "filename": "greeting",
    "voice": "Samantha",
    "rate": 180,
    "format": "wav"
  }
}
```

### 3. `tts_list_voices`
List available system voices:

```json
{
  "name": "tts_list_voices",
  "arguments": {
    "language": "en"
  }
}
```

### 4. `tts_voice_demo`
Play a demo with specific voice:

```json
{
  "name": "tts_voice_demo",
  "arguments": {
    "voice": "Victoria",
    "text": "This is a voice demonstration"
  }
}
```

### 5. `tts_system_info`
Get system TTS information:

```json
{
  "name": "tts_system_info",
  "arguments": {}
}
```

## Configuration

Set default voice and rate via environment variables:

```bash
TTS_DEFAULT_VOICE=Samantha TTS_DEFAULT_RATE=180 npm start
```

Or via command line:

```bash
node dist/index.js --defaultRate 250
```

## MCP Client Setup

> **Note**: Replace `/path/to/mac-say-mcp` with the actual path to your project directory. Use `pwd` in the project directory to get the full path.

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mac-say-mcp": {
      "command": "node",
      "args": ["/path/to/mac-say-mcp/dist/index.js"],
      "env": {
        "TTS_DEFAULT_VOICE": "Alex",
        "TTS_DEFAULT_RATE": "200"
      }
    }
  }
}
```

### VS Code MCP Extension

```json
{
  "mcp.servers": [
    {
      "name": "mac-say-mcp",
      "command": "npx",
      "args": ["-y", "mac-say-mcp@latest"]
    }
  ]
}
```

### Cursor IDE

Add to your Cursor settings or create a `.cursormcp` configuration file:

```json
{
  "mcpServers": {
    "mac-say-mcp": {
      "command": "npx",
      "args": ["-y", "mac-say-mcp@latest"],
      "env": {
        "TTS_DEFAULT_VOICE": "Alex",
        "TTS_DEFAULT_RATE": "200"
      }
    }
  }
}
```

Alternatively, use the built-in MCP server configuration in Cursor:

1. Open Cursor Settings
2. Go to "MCP Servers" 
3. Add a new server:
   - **Name**: `mac-say-mcp`
   - **Command**: `npx`
   - **Args**: `-y mac-say-mcp@latest`

### Zencoder

For Zencoder AI assistant integration, add to your MCP configuration:

```json
{
  "servers": {
    "mac-say-mcp": {
      "command": "npx",
      "args": ["-y", "mac-say-mcp@latest"],
      "description": "Text-to-speech server using macOS say command",
      "env": {
        "TTS_DEFAULT_VOICE": "Alex",
        "TTS_DEFAULT_RATE": "200"
      }
    }
  }
}
```

## Development Architecture

### Project Structure

```
mac-say-mcp/
├── src/
│   └── index.ts          # TypeScript source code
├── dist/
│   └── index.js          # Compiled JavaScript (generated)
├── audio/                # Generated audio files
├── tsconfig.json         # TypeScript configuration
├── build.js              # esbuild configuration
└── package.json          # Dependencies and scripts
```

### Type Safety

Full TypeScript support with:
- Interface definitions for all MCP tools
- Type guards for runtime parameter validation
- Strict type checking enabled
- Modern ES2022 target

### Build Process

- **esbuild** for fast compilation and bundling
- **External dependencies** preserved (MCP SDK)
- **ES Modules** output for Node.js compatibility
- **Source maps** in development mode
- **Minification** in production mode

## Audio Formats

| Format | Extension | Quality | Size |
|--------|-----------|---------|------|
| AIFF   | `.aiff`   | High    | Large |
| WAV    | `.wav`    | High    | Large |  
| MP4    | `.mp4`    | Good    | Small |

## Voice Parameters

- **Rate**: 50-500 words per minute
- **Voices**: System-dependent (174 on typical macOS)
- **Languages**: Multiple languages supported

## Error Handling

- Parameter validation with descriptive errors
- Type-safe error responses
- Graceful handling of missing voices
- File system error recovery

## Requirements

- **macOS**: Required for `say` command
- **Node.js**: 18.0.0 or higher
- **TypeScript**: 5.3.0 or higher
- **esbuild**: 0.19.0 or higher

## Release Management

This project uses automated releases with [release-it](https://github.com/release-it/release-it) and conventional changelog generation.

### Creating Releases

```bash
# Patch release (1.0.0 → 1.0.1) - for bug fixes
npm run release:patch

# Minor release (1.0.0 → 1.1.0) - for new features  
npm run release:minor

# Major release (1.0.0 → 2.0.0) - for breaking changes
npm run release:major

# Test release without publishing
npm run release:dry

# Local testing (no publish/push)
npm run release:local:dry
```

### Changelog Generation

The project automatically generates:
- **CHANGELOG.md** from conventional commit messages
- **GitHub Release Notes** from the latest changelog entries

```bash
# Generate changelog for latest version only
npm run changelog

# Update entire CHANGELOG.md file
npm run changelog:all
```

### Commit Message Format

Use [conventional commits](https://www.conventionalcommits.org/) for automatic changelog generation:

```bash
# Features
git commit -m "feat: add new voice filtering option"

# Bug fixes  
git commit -m "fix: resolve audio file generation error"

# Documentation
git commit -m "docs: update installation instructions"

# Breaking changes
git commit -m "feat!: change TTS API interface"
```

### Release Process

1. **Make changes** with conventional commit messages
2. **Run tests** and type checking: `npm run typecheck`
3. **Create release**: `npm run release:patch` (or minor/major)
4. **Automatic steps**:
   - Version bump in package.json
   - CHANGELOG.md update
   - Git commit and tag
   - GitHub release with changelog
   - npm package publication

## Contributing

1. Make changes in `src/index.ts`
2. Use conventional commit messages
3. Run `npm run typecheck` to verify types
4. Test with `npm run build && npm start`
5. Update documentation as needed

## License

MIT License - see LICENSE file for details.

## Troubleshooting

### Build Issues
```bash
# Clear build cache
npm run clean
npm run build
```

### Type Errors
```bash
# Check TypeScript errors
npm run typecheck
```

### Runtime Issues
```bash
# Test say command directly
say -v Alex "Hello world"
say -v "?" # List voices
```

### Audio File Issues
```bash
# Check audio directory permissions
ls -la audio/
```

This TypeScript version provides better development experience with type safety, modern tooling, and fast builds while maintaining full compatibility with the original MCP server functionality.