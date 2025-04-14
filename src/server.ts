#!/usr/bin/env node
import { FastMCP, UserError } from "fastmcp";
import { z } from "zod";
import { MemosClient } from "./memos-client.js";
import { MemosError, Visibility } from "./types.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Constants definition
const MEMOS_URL = process.env.MEMOS_URL;
const MEMOS_API_KEY = process.env.MEMOS_API_KEY;
const MEMOS_TIMEOUT = process.env.MEMOS_TIMEOUT ? parseInt(process.env.MEMOS_TIMEOUT) : 15000;

// Check required environment variables
if (!MEMOS_URL) {
  console.error("Error: MEMOS_URL environment variable is required");
  process.exit(1);
}

if (!MEMOS_API_KEY) {
  console.error("Error: MEMOS_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize FastMCP server
const server = new FastMCP({
  name: "memos-mcp-server",
  version: "0.1.0",
});

// Initialize Memos client
let memosClient: MemosClient;
try {
  memosClient = new MemosClient(MEMOS_URL, MEMOS_API_KEY, MEMOS_TIMEOUT);
} catch (error) {
  console.error(`Error initializing Memos client: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

// Register search Memos tool
server.addTool({
  name: "search_memo",
  description: "Search for memos",
  parameters: z.object({
    key_word: z.string().describe("The key words to search for in the memo content."),
  }),
  execute: async (args) => {
    try {
      const results = await memosClient.searchMemos(args.key_word);
      const content = results.map(memo => memo.content).join(", ");
      return `Search result:\n${content}`;
    } catch (error) {
      if (error instanceof MemosError) {
        throw new UserError(error.message);
      }
      throw new UserError(`Error searching memos: ${String(error)}`);
    }
  },
});

// Register create Memo tool
server.addTool({
  name: "create_memo",
  description: "Create a new memo",
  parameters: z.object({
    content: z.string().describe("The content of the memo."),
    visibility: z.enum(["PUBLIC", "PROTECTED", "PRIVATE"]).default("PRIVATE").describe("The visibility of the memo."),
    tags: z.array(z.string()).optional().describe("List of tags for the memo"),
  }),
  execute: async (args) => {
    try {
      const visibility = args.visibility as Visibility;
      const result = await memosClient.createMemo(args.content, args.tags || [], visibility);
      return `Memo created: ${result.id}`;
    } catch (error) {
      if (error instanceof MemosError) {
        throw new UserError(error.message);
      }
      throw new UserError(`Error creating memo: ${String(error)}`);
    }
  },
});

// Register get Memo tool
server.addTool({
  name: "get_memo",
  description: "Get a memo",
  parameters: z.object({
    name: z.string().describe("The name of the memo. Format: memos/{id}"),
  }),
  execute: async (args) => {
    try {
      const result = await memosClient.getMemo(args.name);
      return `Memo:\n${result.content}`;
    } catch (error) {
      if (error instanceof MemosError) {
        throw new UserError(error.message);
      }
      throw new UserError(`Error getting memo: ${String(error)}`);
    }
  },
});

// Register list Memo tags tool
server.addTool({
  name: "list_memo_tags",
  description: "List all existing memo tags",
  parameters: z.object({
    parent: z.string().default("memos/-").describe("The parent, who owns the tags. Format: memos/{id}. Use \"memos/-\" to list all tags."),
    visibility: z.enum(["PUBLIC", "PROTECTED", "PRIVATE"]).default("PRIVATE").describe("The visibility of the tags."),
  }),
  execute: async (args) => {
    try {
      const visibility = args.visibility as Visibility;
      const result = await memosClient.listMemoTags(args.parent, visibility);
      const tags = Object.keys(result).join(", ");
      return `Tags:\n${tags}`;
    } catch (error) {
      if (error instanceof MemosError) {
        throw new UserError(error.message);
      }
      throw new UserError(`Error listing memo tags: ${String(error)}`);
    }
  },
});

// Start server
server.start({
  transportType: "stdio",
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});
