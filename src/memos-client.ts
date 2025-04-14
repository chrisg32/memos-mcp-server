import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Memo, MemosError, MemoTagsResponse, SearchMemosResponse, UserStatus, Visibility } from './types.js';

/**
 * Memos 客戶端類
 * 用於與 Memos API 進行交互
 */
export class MemosClient {
  private client: AxiosInstance;
  private url: string;
  private apiKey: string;
  private timeout: number;

  /**
   * 初始化 Memos 客戶端
   * @param memosUrl Memos API URL
   * @param memosApiKey Memos API Key
   * @param timeout 請求超時時間（毫秒）
   */
  constructor(memosUrl: string, memosApiKey: string, timeout: number = 15000) {
    if (!memosUrl) {
      throw new MemosError('Memos URL is required');
    }

    if (!memosApiKey) {
      throw new MemosError('Memos API Key is required');
    }

    this.url = memosUrl;
    this.apiKey = memosApiKey;
    this.timeout = timeout;

    // 創建 axios 實例
    this.client = axios.create({
      baseURL: this.url,
      timeout: this.timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * 通過驗證狀態獲取用戶 ID
   * @returns 用戶 ID
   */
  async getUserId(): Promise<string> {
    try {
      const response = await this.client.post<UserStatus>('/api/v1/auth/status');
      
      const userId = response.data.name;
      if (!userId) {
        throw new MemosError('Could not retrieve user ID from auth status');
      }
      
      return userId;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error getting user ID: ${error.message}`);
      }
      throw new MemosError(`Error getting user ID: ${String(error)}`);
    }
  }

  /**
   * 搜索 Memo
   * @param keyWord 搜索關鍵詞
   * @returns 符合條件的 Memo 列表
   */
  async searchMemos(keyWord: string): Promise<Memo[]> {
    try {
      // 首先獲取用戶 ID
      const userId = await this.getUserId();
      
      // 配置請求參數
      const params: Record<string, string | number> = {
        filter: `content.contains("${keyWord}")`,
        pageSize: 20,
      };
      
      // 發送請求
      const response = await this.client.get<SearchMemosResponse>(
        `/api/v1/${userId}/memos`,
        { params }
      );
      
      return response.data.memos || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error searching memos: ${error.message}`);
      }
      throw new MemosError(`Error searching memos: ${String(error)}`);
    }
  }

  /**
   * 創建新的 Memo
   * @param content Memo 內容
   * @param tags 標籤列表
   * @param visibility 可見性設置
   * @returns 創建的 Memo 對象
   */
  async createMemo(content: string, tags: string[] = [], visibility: Visibility = Visibility.PRIVATE): Promise<Memo> {
    try {
      // 格式化內容，包含標籤
      let formattedContent = content;
      if (tags.length > 0) {
        // 在內容末尾添加標籤
        formattedContent += '\n\n' + tags.join(' ');
      }
      
      // 準備請求負載
      const payload = {
        content: formattedContent,
        visibility: visibility,
      };
      
      // 發送請求
      const response = await this.client.post<Memo>(
        '/api/v1/memos',
        payload
      );
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error creating memo: ${error.message}`);
      }
      throw new MemosError(`Error creating memo: ${String(error)}`);
    }
  }

  /**
   * 獲取指定的 Memo
   * @param memoId Memo ID
   * @returns Memo 對象
   */
  async getMemo(memoId: string): Promise<Memo> {
    try {
      // 格式化名稱
      const name = memoId.startsWith('memos/') ? memoId : `memos/${memoId}`;
      
      // 發送請求
      const response = await this.client.get<Memo>(`/api/v1/${name}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error getting memo: ${error.message}`);
      }
      throw new MemosError(`Error getting memo: ${String(error)}`);
    }
  }

  /**
   * 列出所有 Memo 標籤
   * @param parent 父級資源（默認為 "memos/-"）
   * @param visibility 可見性過濾
   * @returns 標籤列表及其使用次數
   */
  async listMemoTags(parent: string = 'memos/-', visibility: Visibility = Visibility.PRIVATE): Promise<Record<string, number>> {
    try {
      // 配置請求參數
      const params: Record<string, string> = {
        filter: `visibilities == ["${visibility}"]`,
      };
      
      // 發送請求
      const response = await this.client.get<MemoTagsResponse>(
        `/api/v1/${parent}/tags`,
        { params }
      );
      
      return response.data.tagAmounts || {};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error listing memo tags: ${error.message}`);
      }
      throw new MemosError(`Error listing memo tags: ${String(error)}`);
    }
  }
}