/**
 * Memos MCP 伺服器類型定義
 */

/**
 * 可見性枚舉
 */
export enum Visibility {
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE'
}

/**
 * Memos API 錯誤類型
 */
export class MemosError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MemosError';
  }
}

/**
 * Memo 物件介面
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
 * Memo 標籤結構
 */
export interface TagAmount {
  [tag: string]: number;
}

/**
 * Memo 標籤響應
 */
export interface MemoTagsResponse {
  tagAmounts: TagAmount;
}

/**
 * Memo 搜尋結果介面
 */
export interface SearchMemosResponse {
  memos: Memo[];
}

/**
 * 使用者狀態介面
 */
export interface UserStatus {
  name: string;
  id: string;
  [key: string]: any;
}