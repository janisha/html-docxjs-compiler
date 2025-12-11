import { ImageDownloadStrategy, ImageDownloadStrategyManager } from '../strategies';

/**
 * Configuration options for HTML to DOCX conversion
 * All options are optional
 */
export interface HtmlToDocxOptions {
  /**
   * Custom image download strategy manager (optional)
   * 
   * If not provided:
   * - Data URI images (base64) will still work
   * - URL-based images will be skipped with a warning message
   * 
   * If provided:
   * - Uses the configured strategies to download images from URLs
   * - Strategies are checked in order, first matching strategy is used
   * 
   * @example Basic usage with HTTP strategy
   * ```typescript
   * import { 
   *   transformHtmlToDocx, 
   *   ImageDownloadStrategyManager,
   *   HttpImageDownloadStrategy 
   * } from 'html-docxjs-compiler';
   * 
   * const strategyManager = new ImageDownloadStrategyManager([
   *   new HttpImageDownloadStrategy()
   * ]);
   * 
   * const options = { strategyManager };
   * const docx = await transformHtmlToDocx(html, options);
   * ```
   * 
   * @example Multiple strategies
   * ```typescript
   * const strategyManager = new ImageDownloadStrategyManager([
   *   new FirebaseImageDownloadStrategy(),
   *   new HttpImageDownloadStrategy() // Fallback
   * ]);
   * ```
   */
  strategyManager?: ImageDownloadStrategyManager;
}
