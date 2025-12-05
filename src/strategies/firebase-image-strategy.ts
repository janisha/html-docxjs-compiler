import firebase from 'firebase-admin';
import { ImageDownloadStrategy } from './image-download-strategy';

/**
 * Configuration for Firebase image download strategy
 */
export interface FirebaseImageStrategyConfig {
  /**
   * Firebase Storage base URL
   * @example 'https://firebasestorage.googleapis.com/v0/b/my-bucket.appspot.com'
   */
  storageUrl: string;

  /**
   * Firebase Storage bucket name
   * @example 'my-bucket.appspot.com'
   */
  bucketName: string;
}

/**
 * Strategy for downloading images from Firebase Storage
 * Requires firebase-admin to be initialized externally
 */
export class FirebaseImageDownloadStrategy implements ImageDownloadStrategy {
  constructor(private config: FirebaseImageStrategyConfig) {}

  canHandle(url: string): boolean {
    return url.startsWith(this.config.storageUrl);
  }

  async download(url: string): Promise<string> {
    try {
      // Decode URL-encoded characters
      let filePath = decodeURIComponent(url);
      
      // Remove the base URL and /o/ path
      const baseUrlWithPath = `${this.config.storageUrl}/o/`;
      filePath = filePath.replace(baseUrlWithPath, '');
      
      // Remove query parameters
      filePath = filePath.split('?')[0];

      const data = await firebase
        .storage()
        .bucket(this.config.bucketName)
        .file(filePath)
        .download();

      const base64 = Buffer.from(data[0]).toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      throw new Error(`Failed to download image from Firebase Storage: ${error}`);
    }
  }
}
