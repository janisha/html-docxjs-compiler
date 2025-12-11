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
    }
    // No default strategy - strategies must be explicitly provided or added
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
    if (this.strategies.length === 0) {
      throw new Error(
        `Cannot download image from "${url}": No image download strategies configured. ` +
        `Please add at least one strategy (e.g., HttpImageDownloadStrategy) to the ImageDownloadStrategyManager.`
      );
    }

    for (const strategy of this.strategies) {
      if (strategy.canHandle(url)) {
        return await strategy.download(url);
      }
    }

    const availableStrategies = this.strategies.map(s => s.constructor.name).join(', ');
    throw new Error(
      `Cannot download image from "${url}": No suitable strategy found. ` +
      `Available strategies: ${availableStrategies}. ` +
      `The URL format may not be supported by any configured strategy.`
    );
  }
}
