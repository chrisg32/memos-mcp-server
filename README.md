# Memos MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for integrating [Memos](https://github.com/usememos/memos) with AI assistants that support the MCP protocol, such as Claude.

## ✨ Features

- Search memos using keywords
- Create new memos with customizable visibility settings and tags
- Retrieve specific memos by ID
- Get user information

## 🚀 Installation

### Claude Desktop Setup

1. **Install Claude Desktop**
   - Download [Claude Desktop](https://claude.ai/download)
   - Ensure you have the latest version (Menu: Claude -> Check for Updates...)

2. **Configure MCP Server**

   ```json
   {
     "mcpServers": {
       "memos": {
         "command": "npx",
         "args": [
           "memos-mcp-server"
         ],
         "env": {
           "MEMOS_URL": "https://your-memos-instance.com",
           "MEMOS_API_KEY": "your_api_key"
         }
       }
     }
   }
   ```

## 🛠️ Available Tools

### search_memo

Search for memos using keywords.

**Parameters:**

- `key_word` (string): The keywords to search for in memo content
- `state` (string, optional): The state of memos to list (default: "NORMAL", can also be "ARCHIVED")

### create_memo

Create a new memo.

**Parameters:**

- `content` (string): Memo content
- `visibility` (string, optional): Visibility setting (default: "PRIVATE", options: "PUBLIC", "PROTECTED", "PRIVATE")
- `tags` (array of strings, optional): List of tags for the memo

### get_memo

Retrieve a specific memo by its ID.

**Parameters:**

- `name` (string): Memo name, format is `memos/{id}` or just the ID number

### get_user

Get current user information.

## 🧪 Development

This project uses TypeScript with the FastMCP framework for MCP server development.

### Setup

```bash
# Install dependencies
npm install

# Create .env file and set environment variables
cp .env.example .env
# Edit .env file with your Memos API details
```

### Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run Production Server

```bash
npm start
```

### Test with `mcp-cli`

The fastest way to test and debug your server is with `fastmcp dev`:

```bash
npx fastmcp dev src/server.ts
```

This will run your server with [`mcp-cli`](https://github.com/wong2/mcp-cli) for testing and debugging your MCP server in the terminal.

### Inspect with `MCP Inspector`

You can also use the official [`MCP Inspector`](https://modelcontextprotocol.io/docs/tools/inspector) to inspect your server with a Web UI:

```bash
npx fastmcp inspect src/server.ts
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Visit the [issues page](https://github.com/stephen9412/memos-mcp-server/issues).

## 📄 License

[MIT License](LICENSE) - Copyright (c) 2025 Stephen J. Li
