import firebase from 'firebase-admin';
import { ImageDownloadStrategy } from './image-download.strategy';

/**
 * Strategy for downloading images from Firebase Storage
 * 
 * @example
 * ```typescript
 * const firebaseStrategy = new FirebaseImageDownloadStrategy(
 *   'https://firebasestorage.googleapis.com/v0/b/my-bucket.appspot.com',
 *   'my-bucket.appspot.com'
 * );
 * 
 * const docx = await transformHtmlToDocx(html, {
 *   imageStrategies: [firebaseStrategy]
 * });
 * ```
 */
export class FirebaseImageDownloadStrategy implements ImageDownloadStrategy {
  constructor(
    private readonly storageUrl: string,
    private readonly bucketName: string,
  ) {}

  canHandle(url: string): boolean {
    return url.startsWith(this.storageUrl);
  }

  async download(url: string): Promise<string> {
    try {
      // Decode URL-encoded characters
      let filePath = decodeURIComponent(url);
      
      // Remove the storage URL prefix
      filePath = filePath.replace(`${this.storageUrl}/o/`, '');
      
      // Remove query parameters
      filePath = filePath.split('?')[0];

      const data = await firebase
        .storage()
        .bucket(this.bucketName)
        .file(filePath)
        .download();

      const base64 = Buffer.from(data[0]).toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      throw new Error(`Failed to download image from Firebase Storage: ${error}`);
    }
  }
}
