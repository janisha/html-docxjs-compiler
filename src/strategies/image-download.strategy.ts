/**
 * Interface for custom image download strategies
 * Implement this interface to provide custom image downloading logic
 */
export interface ImageDownloadStrategy {
  /**
   * Check if this strategy can handle the given image URL
   * @param url - Image URL to check
   * @returns True if this strategy should handle this URL
   */
  canHandle(url: string): boolean;

  /**
   * Download image and return as base64 data URI
   * @param url - Image URL to download
   * @returns Base64 data URI string (e.g., 'data:image/png;base64,...')
   */
  download(url: string): Promise<string>;
}
