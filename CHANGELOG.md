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