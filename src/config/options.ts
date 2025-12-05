import { ImageDownloadStrategy } from '../strategies';

/**
 * Configuration options for HTML to DOCX conversion
 */
export interface HtmlToDocxOptions {
  /**
   * Custom image download strategies
   * Provide custom implementations to handle different image sources
   * Strategies are checked in order, first matching strategy is used
   * If no strategy matches, the default HTTP strategy is used
   * 
   * @example
   * ```typescript
   * import { transformHtmlToDocx, FirebaseImageDownloadStrategy } from 'html-docx-compiler';
   * 
   * const options = {
   *   imageStrategies: [
   *     new FirebaseImageDownloadStrategy(
   *       'https://firebasestorage.googleapis.com/v0/b/my-bucket.appspot.com',
   *       'my-bucket.appspot.com'
   *     )
   *   ]
   * };
   * 
   * const docx = await transformHtmlToDocx(html, options);
   * ```
   */
  imageStrategies?: ImageDownloadStrategy[];
}
