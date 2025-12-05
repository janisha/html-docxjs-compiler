import { ImageDownloadStrategy } from './image-download-strategy';
import { HttpImageDownloadStrategy } from './http-image-strategy';

/**
 * Manager for image download strategies
 * Uses chain of responsibility pattern to find appropriate strategy
 */
export class ImageDownloadStrategyManager {
  private strategies: ImageDownloadStrategy[] = [];

  constructor(strategies?: ImageDownloadStrategy[]) {
    if (strategies && strategies.length > 0) {
      this.strategies = strategies;
    } else {
      // Default strategy: HTTP download
      this.strategies = [new HttpImageDownloadStrategy()];
    }
  }

  /**
   * Add a strategy to the chain
   * Strategies are checked in the order they are added
   */
  addStrategy(strategy: ImageDownloadStrategy): void {
    this.strategies.push(strategy);
  }

  /**
   * Download image using the first strategy that can handle the URL
   * @param url - Image URL to download
   * @returns Base64 data URI string
   * @throws Error if no strategy can handle the URL
   */
  async download(url: string): Promise<string> {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(url)) {
        return await strategy.download(url);
      }
    }

    throw new Error(`No strategy found to handle URL: ${url}`);
  }
}
