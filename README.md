# mac-say-mcp

A Model Context Protocol (MCP) server for text-to-speech using macOS say command.

## Installation

```bash
npm install -g mac-say-mcp
```

## Usage

### Starting the server

```bash
mac-say-mcp
```

You can also set default voice and rate:

```bash
# Using environment variables
TTS_DEFAULT_VOICE=Samantha TTS_DEFAULT_RATE=180 mac-say-mcp

# Using command line arguments
mac-say-mcp --defaultRate 180
```

### Available Tools

The server provides the following MCP tools:

#### tts_speak

Convert text to speech and play it immediately.

```json
{
  "text": "Hello, world!",
  "voice": "Alex",  // optional, default: system default
  "rate": 200       // optional, words per minute
}
```

#### tts_save_audio

Convert text to speech and save as audio file.

```json
{
  "text": "Hello, world!",
  "filename": "greeting",
  "voice": "Alex",  // optional
  "rate": 200,      // optional
  "format": "aiff"  // optional, one of: aiff, wav, mp4
}
```

#### tts_list_voices

List all available voices on the system.

```json
{
  "language": "en"  // optional, filter by language
}
```

#### tts_voice_demo

Play a demo phrase with a specific voice.

```json
{
  "voice": "Alex",
  "text": "This is a demonstration"  // optional
}
```

#### tts_system_info

Get information about text-to-speech capabilities.

```json
{}
```

## Requirements

- macOS (requires the `say` command)
- Node.js 14 or higher

## License

MIT