# memos-mcp-server (TypeScript)

一個使用 [MCP(Model Context Protocol)](https://modelcontextprotocol.io) 協議的 [Memos](https://github.com/usememos/memos) 伺服器。

## 功能與工具

- `search_memo`: 使用關鍵字搜索 memos。
- `create_memo`: 創建一條新的 memo。
- `get_memo`: 獲取指定的 memo。
- `list_memo_tags`: 列出所有 memo 標籤。

## 環境變數

- `MEMOS_URL`: Memos API 的 URL
- `MEMOS_API_KEY`: Memos API 密鑰
- `MEMOS_TIMEOUT`: API 請求超時時間（毫秒，默認為 15000）

## 使用方法

### 開發

```bash
# 安裝依賴
npm install

# 創建 .env 文件並設置環境變數
cp .env.example .env
# 編輯 .env 文件

# 運行開發伺服器
npm run dev
```

### 構建

```bash
npm run build
```

### 運行

```bash
npm start
```

### 測試

```bash
npm test
```

## MCP 客戶端配置

將以下配置添加到您的 MCP 客戶端配置文件中：

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

## 參數說明

### search_memo

- `key_word`: 要搜索的關鍵字

### create_memo

- `content`: memo 內容
- `visibility`: 可見性設置 (`PUBLIC`, `PROTECTED`, `PRIVATE`)
- `tags`: 標籤列表

### get_memo

- `name`: memo 名稱，格式為 `memos/{id}`

### list_memo_tags

- `parent`: 父級資源，格式為 `memos/{id}`，默認為 `memos/-`
- `visibility`: 可見性過濾 (`PUBLIC`, `PROTECTED`, `PRIVATE`)

## 許可證

MIT
