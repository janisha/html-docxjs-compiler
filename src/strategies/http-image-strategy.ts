import axios from 'axios';
import { ImageDownloadStrategy } from './image-download-strategy';

/**
 * Default strategy for downloading images from HTTP/HTTPS URLs
 */
export class HttpImageDownloadStrategy implements ImageDownloadStrategy {
  canHandle(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  async download(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      throw new Error(`Failed to download image from ${url}: ${error}`);
    }
  }
}
