# Promptly

A Telegram bot powered by Google Gemini AI that transforms simple ideas into optimized, well-crafted prompts for AI systems.

## Overview

Promptly is a specialized prompt engineering assistant that helps users craft better prompts for AI models. It acts as an expert prompt engineer, refining and optimizing user input into precise, effective prompts that maximize AI output quality.

## Features

- **AI-Powered Prompt Engineering**: Uses Google Gemini 2.5 Flash model to transform simple ideas into effective prompts
- **Conversational Context**: Maintains conversation history (up to 100 messages) for context-aware prompt refinement
- **Rate Limiting**: Built-in protection with 2 messages per minute limit to prevent abuse
- **User Management**: Tracks users in PostgreSQL database with their Telegram information
- **Session Management**: Stores conversation history per user session
- **Message Chunking**: Automatically splits long responses to comply with Telegram's message length limits

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Bot Framework**: [grammY](https://grammy.dev/) - modern Telegram bot framework
- **AI Model**: Google Gemini 2.5 Flash with Google Search integration
- **Database**: PostgreSQL with Drizzle ORM
- **Environment Management**: dotenv for configuration
- **Deployment**: Vercel serverless functions (webhook-based)

## Commands

- `/start` - Initialize the bot and register user
- `/newchat` - Clear conversation history and start fresh
- `/messages` - Display current conversation history (debug)

## How It Works

1. **User Registration**: When a user starts the bot with `/start`, their information is stored in the database
2. **Message Processing**: User messages are added to the conversation history
3. **AI Processing**: The message history is sent to Google Gemini with a specialized system prompt
4. **Response Delivery**: AI responses are formatted (MarkdownV2), chunked if needed, and sent back to the user
5. **Session Management**: All messages are stored in the user's session for context-aware conversations

## Environment Variables

Create a `.env` file with the following variables:

```env
BOT_TOKEN=your_telegram_bot_token
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd promptly
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables in `.env`

4. Run database migrations:
   ```bash
   pnpm drizzle-kit push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Development

- **Dev Mode**: `pnpm dev` - Runs with nodemon for hot-reload
- **Build**: `pnpm build` - Compiles TypeScript to JavaScript
- **Start**: `pnpm start` - Runs the compiled production build

## Deployment

The bot is configured for deployment on Vercel as a serverless function using webhooks. The `vercel.json` configuration routes incoming webhook requests to the bot handler.

## Rate Limiting

- **Per-User Limit**: 2 messages per minute
- **Conversation Limit**: Maximum 100 messages per conversation
- Users are notified when limits are reached and can use `/newchat` to reset

## License

MIT
