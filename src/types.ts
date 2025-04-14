/**
 * Memos MCP Server Type Definitions
 */

/**
 * Visibility Enum
 */
export enum Visibility {
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE'
}

/**
 * Memos API Error Type
 */
export class MemosError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MemosError';
  }
}

/**
 * Memo Object Interface
 */
export interface Memo {
  id: string;
  creatorId: string;
  createdTs: number;
  updatedTs: number;
  content: string;
  visibility: string;
  pinned: boolean;
  resourceIdList?: string[];
  relationList?: any[];
  [key: string]: any;
}

/**
 * Memo Tag Structure
 */
export interface TagAmount {
  [tag: string]: number;
}

/**
 * Memo Tags Response
 */
export interface MemoTagsResponse {
  tagAmounts: TagAmount;
}

/**
 * Memo Search Results Interface
 */
export interface SearchMemosResponse {
  memos: Memo[];
}

/**
 * User Status Interface
 */
export interface UserStatus {
  name: string;
  id: string;
  [key: string]: any;
}