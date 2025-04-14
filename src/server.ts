#!/usr/bin/env node
import { FastMCP, UserError } from "fastmcp";
import { z } from "zod";
import { MemosClient } from "./memos-client.js";
import { MemosError, Visibility } from "./types.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Constants definition
const MEMOS_URL = process.env.MEMOS_URL || '';
const MEMOS_API_KEY = process.env.MEMOS_API_KEY || '';
const MEMOS_TIMEOUT = process.env.MEMOS_TIMEOUT ? parseInt(process.env.MEMOS_TIMEOUT) : 15000;


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

server.addTool({
  name: "get_user",
  description: "Get user information",
  parameters: z.object({}),
  execute: async () => {
    try {
      const user = await memosClient.getUser();
      return `User: ${JSON.stringify(user)}`;
    } catch (error) {
      if (error instanceof MemosError) {
        throw new UserError(error.message);
      }
      throw new UserError(`Error retrieving user details: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Register search Memos tool
server.addTool({
  name: "search_memo",
  description: "Search for memos. By default, no state selection is required unless specified by the user.",
  parameters: z.object({
    key_word: z.string().describe("The key words to search for in the memo content."),
    state: z.enum(["NORMAL", "ARCHIVED"]).default("NORMAL").describe("The state of the memos to list."),
  }),
  execute: async (args) => {
    try {
      const results = await memosClient.searchMemos(args.key_word, args.state);
      const memos = results.map(memo => ({
        name: memo.name,
        state: memo.state,
        creator: memo.creator,
        displayTime: memo.displayTime,
        visibility: memo.visibility,
        tags: memo.tags || [],
        pinned: memo.pinned,
        content: memo.content,
      }));
      return `Search results: ${JSON.stringify(memos)}`;
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
    name: z.string().describe("The name of the memo."),
  }),
  execute: async (args) => {
    try {
      const memo = await memosClient.getMemo(args.name);
      return `Memo: ${JSON.stringify(memo)}`;
    } catch (error) {
      if (error instanceof MemosError) {
        throw new UserError(error.message);
      }
      throw new UserError(`Error getting memo: ${String(error)}`);
    }
  },
});

// Check connection to Memos server
(async () => {
  try {
    // Testing connection to Memos server
    await memosClient.getUser();
    server.start({
      transportType: "stdio",
    });
  } catch (error) {
    console.error(`Error connecting to Memos server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
})();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});
