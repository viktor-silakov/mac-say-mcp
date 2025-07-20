#!/usr/bin/env node

/**
 * MCP Server for Text-to-Speech
 * Provides tools for converting text to speech using macOS say command
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { spawn, exec } from 'child_process';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Global state
const state = {
  audioDir: join(__dirname, 'audio'),
  availableVoices: [],
  defaultVoice: 'Alex',
  defaultRate: 200 // words per minute
};

// Read configuration from command line arguments or environment
function loadConfiguration() {
  // Check command line arguments for defaultVoice
  const args = process.argv;
  state.defaultVoice = process.env.TTS_DEFAULT_VOICE || 'Alex';

  // Check for default rate as well
  const defaultRateIndex = args.findIndex(arg => arg === '--defaultRate');
  if (defaultRateIndex !== -1 && args[defaultRateIndex + 1]) {
    state.defaultRate = parseInt(args[defaultRateIndex + 1]);
    console.error(`Using defaultRate from command line: ${state.defaultRate}`);
  } else if (process.env.TTS_DEFAULT_RATE) {
    state.defaultRate = parseInt(process.env.TTS_DEFAULT_RATE);
    console.error(`Using defaultRate from environment: ${state.defaultRate}`);
  }
}

// Ensure audio directory exists
async function ensureDirectories() {
  try {
    await fs.mkdir(state.audioDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create audio directory:', error);
  }
}

// Get available voices from system
async function getAvailableVoices() {
  return new Promise((resolve) => {
    exec('say -v "?"', (error, stdout) => {
      if (error) {
        console.error('Failed to get voices:', error);
        resolve([]);
        return;
      }

      const voices = stdout.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const match = line.match(/^(\w+)\s+(.+?)\s+#\s*(.+)$/);
          if (match) {
            return {
              name: match[1],
              language: match[2].trim(),
              description: match[3].trim()
            };
          }
          return null;
        })
        .filter(voice => voice !== null);

      resolve(voices);
    });
  });
}

// Tool definitions
const TOOLS = [
  {
    name: "tts_speak",
    description: "Convert text to speech and play it immediately",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to convert to speech"
        },
        voice: {
          type: "string",
          description: "Voice to use (optional, default: Alex)"
        },
        rate: {
          type: "number",
          description: "Speaking rate in words per minute (default: 200)",
          minimum: 50,
          maximum: 500
        }
      },
      required: ["text"]
    }
  },
  {
    name: "tts_save_audio",
    description: "Convert text to speech and save as audio file",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to convert to speech"
        },
        filename: {
          type: "string",
          description: "Name for the audio file (without extension)"
        },
        voice: {
          type: "string",
          description: "Voice to use (optional, default: Alex)"
        },
        rate: {
          type: "number",
          description: "Speaking rate in words per minute (default: 200)",
          minimum: 50,
          maximum: 500
        },
        format: {
          type: "string",
          description: "Audio format: aiff, wav, mp4",
          enum: ["aiff", "wav", "mp4"],
          default: "aiff"
        }
      },
      required: ["text", "filename"]
    }
  },
  {
    name: "tts_list_voices",
    description: "List all available voices on the system",
    inputSchema: {
      type: "object",
      properties: {
        language: {
          type: "string",
          description: "Filter voices by language (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "tts_voice_demo",
    description: "Play a demo phrase with a specific voice",
    inputSchema: {
      type: "object",
      properties: {
        voice: {
          type: "string",
          description: "Voice name to demo"
        },
        text: {
          type: "string",
          description: "Custom text for demo (optional)",
          default: "Hello, this is a voice demonstration."
        }
      },
      required: ["voice"]
    }
  },
  {
    name: "tts_system_info",
    description: "Get information about text-to-speech capabilities",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

// Create and configure server
const server = new Server({
  name: "text-to-speech-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

// Tool handlers
async function handleTTSSpeak(params) {
  const { text, voice = state.defaultVoice, rate = state.defaultRate } = params;

  try {
    const sayArgs = ['-v', voice, '-r', rate.toString(), text];

    await new Promise((resolve, reject) => {
      const sayProcess = spawn('say', sayArgs);

      sayProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`say command failed with code ${code}`));
        }
      });

      sayProcess.on('error', reject);
    });

    return {
      success: true,
      message: `Text spoken successfully with voice "${voice}"`,
      voice,
      rate,
      textLength: text.length
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to speak text: ${error.message}`
    };
  }
}

async function handleTTSSaveAudio(params) {
  const {
    text,
    filename,
    voice = state.defaultVoice,
    rate = state.defaultRate,
    format = "aiff"
  } = params;

  const outputPath = join(state.audioDir, `${filename}.${format}`);

  try {
    const sayArgs = ['-v', voice, '-r', rate.toString(), '-o', outputPath];

    // Add format-specific arguments
    if (format === 'wav') {
      sayArgs.push('--data-format=LEF32@22050');
    } else if (format === 'mp4') {
      sayArgs.push('--data-format=alac');
    }

    sayArgs.push(text);

    await new Promise((resolve, reject) => {
      const sayProcess = spawn('say', sayArgs);

      sayProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`say command failed with code ${code}`));
        }
      });

      sayProcess.on('error', reject);
    });

    // Check if file was created
    const stats = await fs.stat(outputPath);

    return {
      success: true,
      message: `Audio saved successfully: ${filename}.${format}`,
      outputPath,
      voice,
      rate,
      format,
      fileSize: stats.size,
      textLength: text.length
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to save audio: ${error.message}`
    };
  }
}

async function handleTTSListVoices(params) {
  const { language } = params;

  try {
    let voices = state.availableVoices;

    // Filter by language if specified
    if (language) {
      voices = voices.filter(voice =>
        voice.language.toLowerCase().includes(language.toLowerCase())
      );
    }

    // Group voices by language
    const voicesByLanguage = voices.reduce((acc, voice) => {
      const lang = voice.language;
      if (!acc[lang]) {
        acc[lang] = [];
      }
      acc[lang].push({
        name: voice.name,
        description: voice.description
      });
      return acc;
    }, {});

    return {
      success: true,
      totalVoices: voices.length,
      filteredBy: language || 'none',
      voicesByLanguage,
      availableLanguages: Object.keys(voicesByLanguage).sort(),
      defaultVoice: state.defaultVoice
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to list voices: ${error.message}`
    };
  }
}

async function handleTTSVoiceDemo(params) {
  const { voice, text = "Hello, this is a voice demonstration." } = params;

  try {
    // Check if voice exists
    const voiceExists = state.availableVoices.some(v => v.name === voice);
    if (!voiceExists) {
      return {
        success: false,
        error: `Voice "${voice}" not found. Use tts_list_voices to see available voices.`
      };
    }

    const sayArgs = ['-v', voice, text];

    await new Promise((resolve, reject) => {
      const sayProcess = spawn('say', sayArgs);

      sayProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`say command failed with code ${code}`));
        }
      });

      sayProcess.on('error', reject);
    });

    const voiceInfo = state.availableVoices.find(v => v.name === voice);

    return {
      success: true,
      message: `Voice demo played successfully`,
      voice,
      voiceInfo,
      demoText: text
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to play voice demo: ${error.message}`
    };
  }
}

async function handleTTSSystemInfo() {
  try {
    // Check say command availability
    const sayAvailable = await new Promise((resolve) => {
      exec('which say', (error) => {
        resolve(!error);
      });
    });

    // Get audio files
    const audioFiles = await fs.readdir(state.audioDir).catch(() => []);
    const audioFilesList = audioFiles.filter(f =>
      f.endsWith('.aiff') || f.endsWith('.wav') || f.endsWith('.mp4')
    );

    return {
      success: true,
      system: process.platform,
      sayCommand: {
        available: sayAvailable,
        path: sayAvailable ? '/usr/bin/say' : 'not found'
      },
      voices: {
        total: state.availableVoices.length,
        default: state.defaultVoice,
        languages: [...new Set(state.availableVoices.map(v => v.language))].sort()
      },
      settings: {
        defaultRate: state.defaultRate,
        audioDirectory: state.audioDir
      },
      audioFiles: {
        count: audioFilesList.length,
        files: audioFilesList
      },
      supportedFormats: ['aiff', 'wav', 'mp4']
    };

  } catch (error) {
    return {
      success: false,
      error: `Failed to get system info: ${error.message}`
    };
  }
}

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: params } = request.params;

  try {
    let result;

    switch (name) {
      case "tts_speak":
        result = await handleTTSSpeak(params);
        break;
      case "tts_save_audio":
        result = await handleTTSSaveAudio(params);
        break;
      case "tts_list_voices":
        result = await handleTTSListVoices(params);
        break;
      case "tts_voice_demo":
        result = await handleTTSVoiceDemo(params);
        break;
      case "tts_system_info":
        result = await handleTTSSystemInfo();
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: error.message
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start server
async function runServer() {
  // Load configuration first
  loadConfiguration();

  await ensureDirectories();

  // Load available voices
  state.availableVoices = await getAvailableVoices();
  console.error(`Loaded ${state.availableVoices.length} voices`);
  console.error(`Default voice: ${state.defaultVoice}`);
  console.error(`Default rate: ${state.defaultRate}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Text-to-Speech MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});