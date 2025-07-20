

## 1.0.1 (2025-07-20)


### Features

* add release-it configuration for automated releases ([4f5386a](https://github.com/yourusername/mac-say-mcp/commit/4f5386a1780e8ecd18e2745e45b20eb1c75dbbe0))
* complete release-it setup with local testing configuration ([35c54e9](https://github.com/yourusername/mac-say-mcp/commit/35c54e9db1e26b8dec94af1b623b7854bcb6e336))
* initial release with TypeScript setup and release automation ([784d380](https://github.com/yourusername/mac-say-mcp/commit/784d38053e95b02fcb2ade52132f6b4a73b847e1))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - TBD

### Added
- Initial release of mac-say-mcp
- MCP Server for text-to-speech using macOS say command
- Five main TTS tools: speak, save_audio, list_voices, voice_demo, system_info
- Support for multiple audio formats (aiff, wav, mp4)
- Voice filtering and management
- Rate control (50-500 WPM)
- Error handling for TTS failures
- Automatic audio directory creation

### Features
- **speak**: Convert text to speech with customizable voice and rate
- **save_audio**: Save TTS output to audio files in various formats
- **list_voices**: List available system voices with language filtering
- **voice_demo**: Demo voices with sample text
- **system_info**: Get TTS system information and capabilities

### Technical Details
- Built with ES6+ modules
- MCP SDK integration for protocol compatibility
- macOS-only compatibility (requires `say` command)
- Node.js 14+ requirement
- Zero external dependencies beyond MCP SDK
