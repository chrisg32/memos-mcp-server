# memos-mcp-server (TypeScript)

A [Memos](https://github.com/usememos/memos) server using the [MCP (Model Context Protocol)](https://modelcontextprotocol.io) protocol.

## Features and Tools

- `search_memo`: Search memos using keywords.
- `create_memo`: Create a new memo.
- `get_memo`: Get a specific memo.
- `list_memo_tags`: List all memo tags.

## Environment Variables

- `MEMOS_URL`: URL of the Memos API
- `MEMOS_API_KEY`: Memos API key
- `MEMOS_TIMEOUT`: API request timeout (milliseconds, default is 15000)

## Usage

### Development

```bash
# Install dependencies
npm install

# Create .env file and set environment variables
cp .env.example .env
# Edit .env file

# Run development server
npm run dev
```

### Build

```bash
npm run build
```

### Run

```bash
npm start
```

### Test

```bash
npm test
```

## MCP Client Configuration

Add the following configuration to your MCP client configuration file:

```json
{
  "mcpServers": {
    "memos": {
      "command": "node",
      "args": ["./dist/server.js"],
      "env": {
        "MEMOS_URL": "https://memos.example.com",
        "MEMOS_API_KEY": "your_api_key",
        "MEMOS_TIMEOUT": "15000"
      }
    }
  }
}
```

## Parameter Descriptions

### search_memo

- `key_word`: Keyword to search for

### create_memo

- `content`: Memo content
- `visibility`: Visibility setting (`PUBLIC`, `PROTECTED`, `PRIVATE`)
- `tags`: List of tags

### get_memo

- `name`: Memo name, format is `memos/{id}`

### list_memo_tags

- `parent`: Parent resource, format is `memos/{id}`, default is `memos/-`
- `visibility`: Visibility filter (`PUBLIC`, `PROTECTED`, `PRIVATE`)

## License

MIT
