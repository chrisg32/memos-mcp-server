import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Memo, MemosError, SearchMemosResponse, ListMemosResponse, Visibility } from './types.js';

/**
 * Memos Client Class
 * Used for interacting with Memos API
 */
export class MemosClient {
  private client: AxiosInstance;
  private url: string;
  private apiKey: string;
  private timeout: number;

  /**
   * Initialize Memos client
   * @param memosUrl Memos API URL
   * @param memosApiKey Memos API Key
   * @param timeout Request timeout (milliseconds)
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

    // Create axios instance
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
   * Verify connection to Memos server by listing memos with a small page size
   */
  async checkConnection(): Promise<void> {
    try {
      await this.client.get('/api/v1/memos', { params: { pageSize: 1 } });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error connecting to Memos server: ${error.message}`);
      }
      throw new MemosError(`Error connecting to Memos server: ${String(error)}`);
    }
  }

  /**
   * Search Memos
   * @param keyWord Search keyword
   * @param state Filter by memo state (default is NORMAL, can also be ARCHIVED)
   * @returns List of Memos matching the criteria
   */
  async searchMemos(keyWord: string, state: string): Promise<Memo[]> {
    try {
      // Configure request parameters
      const params: Record<string, string | number> = {
        filter: `content.contains("${keyWord}")`,
        state: state,
      };

      // Send request — v0.26+ uses /api/v1/memos directly
      const response = await this.client.get<SearchMemosResponse>(
        '/api/v1/memos',
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
   * List Memos
   * @param pageSize Maximum number of memos to return
   * @param pageToken Token for cursor-based pagination
   * @returns List of Memos and next page token
   */
  async listMemos(pageSize: number = 10, pageToken?: string): Promise<ListMemosResponse> {
    try {
      // Configure request parameters
      const params: Record<string, string | number> = {
        pageSize: pageSize,
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      // Send request
      const response = await this.client.get<ListMemosResponse>(
        '/api/v1/memos',
        { params }
      );

      return {
        memos: response.data.memos || [],
        nextPageToken: response.data.nextPageToken || '',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error listing memos: ${error.message}`);
      }
      throw new MemosError(`Error listing memos: ${String(error)}`);
    }
  }

  /**
   * Create new Memo
   * @param content Memo content
   * @param tags List of tags
   * @param visibility Visibility settings
   * @returns Created Memo object
   */
  async createMemo(content: string, tags: string[] = [], visibility: Visibility = Visibility.PRIVATE): Promise<Memo> {
    try {
      // Format content, including tags
      let formattedContent = content;
      if (tags.length > 0) {
        // Add tags at the end of content
        formattedContent += '\n\n' + tags.join(' ');
      }
      
      // Prepare request payload
      const payload = {
        content: formattedContent,
        visibility: visibility,
      };
      
      // Send request
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
   * Get specified Memo
   * @param memoId Memo ID
   * @returns Memo object
   */
  async getMemo(memoId: string): Promise<Memo> {
    try {
      // Format name
      const name = memoId.startsWith('memos/') ? memoId : `memos/${memoId}`;
      
      // Send request
      const response = await this.client.get<Memo>(`/api/v1/${name}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error getting memo: ${error.message}`);
      }
      throw new MemosError(`Error getting memo: ${String(error)}`);
    }
  }
}
