/**
 * Strategy interface for downloading images from various sources
 */
export interface ImageDownloadStrategy {
  /**
   * Check if this strategy can handle the given URL
   * @param url - Image URL to check
   * @returns True if this strategy can handle the URL
   */
  canHandle(url: string): boolean;

  /**
   * Download image and return as base64 data URI
   * @param url - Image URL to download
   * @returns Base64 data URI string (e.g., 'data:image/png;base64,...')
   */
  download(url: string): Promise<string>;
}
