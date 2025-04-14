import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Memo, MemosError, MemoTagsResponse, SearchMemosResponse, UserStatus, Visibility } from './types.js';

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
   * Get user details through authentication status
   * @returns User details
   */
  async getUser(): Promise<UserStatus> {
    try {
      const response = await this.client.post<UserStatus>('/api/v1/auth/status');
      
      if (!response.data) {
        throw new MemosError('Could not retrieve user details from auth status');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new MemosError(`Error getting user details: ${error.message}`);
      }
      throw new MemosError(`Error getting user details: ${String(error)}`);
    }
  }

  /**
   * Get user ID through authentication status
   * @returns User ID
   */
  async getUserId(): Promise<string> {
    try {
      const userDetails = await this.getUser();
      
      const userId = userDetails.name;
      if (!userId) {
        throw new MemosError('Could not retrieve user ID from user details');
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
   * Search Memos
   * @param keyWord Search keyword
   * @returns List of Memos matching the criteria
   */
  async searchMemos(keyWord: string): Promise<Memo[]> {
    try {
      // First get user ID
      const userId = await this.getUserId();
      
      // Configure request parameters
      const params: Record<string, string | number> = {
        filter: `content.contains("${keyWord}")`,
        pageSize: 20,
      };
      
      // Send request
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

  /**
   * List all Memo tags
   * @param parent Parent resource (default is "memos/-")
   * @param visibility Visibility filter
   * @returns List of tags and their usage count
   */
  async listMemoTags(parent: string = 'memos/-', visibility: Visibility = Visibility.PRIVATE): Promise<Record<string, number>> {
    try {
      // Configure request parameters
      const params: Record<string, string> = {
        filter: `visibilities == ["${visibility}"]`,
      };
      
      // Send request
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