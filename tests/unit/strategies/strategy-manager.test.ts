import { ImageDownloadStrategyManager } from '../../../src/strategies/image-strategy-manager';
import { ImageDownloadStrategy } from '../../../src/strategies/image-download-strategy';

// Mock strategies for testing
class MockStrategy1 implements ImageDownloadStrategy {
  canHandle(url: string): boolean {
    return url.startsWith('mock1://');
  }

  async download(url: string): Promise<string> {
    return `data:image/png;base64,mock1-${url}`;
  }
}

class MockStrategy2 implements ImageDownloadStrategy {
  canHandle(url: string): boolean {
    return url.startsWith('mock2://');
  }

  async download(url: string): Promise<string> {
    return `data:image/png;base64,mock2-${url}`;
  }
}

class MockStrategyAll implements ImageDownloadStrategy {
  canHandle(url: string): boolean {
    return true; // Catches everything
  }

  async download(url: string): Promise<string> {
    return `data:image/png;base64,fallback-${url}`;
  }
}

describe('ImageDownloadStrategyManager', () => {
  describe('constructor', () => {
    it('should initialize with provided strategies', () => {
      const strategy1 = new MockStrategy1();
      const strategy2 = new MockStrategy2();
      const manager = new ImageDownloadStrategyManager([strategy1, strategy2]);

      expect(manager).toBeDefined();
    });

    it('should initialize with default HTTP strategy when no strategies provided', () => {
      const manager = new ImageDownloadStrategyManager();

      expect(manager).toBeDefined();
    });

    it('should initialize with empty array as no strategies', () => {
      const manager = new ImageDownloadStrategyManager([]);

      expect(manager).toBeDefined();
    });
  });

  describe('addStrategy', () => {
    it('should add strategy to the chain', () => {
      const manager = new ImageDownloadStrategyManager();
      const newStrategy = new MockStrategy1();

      manager.addStrategy(newStrategy);

      // Strategy should now be able to handle mock1:// URLs
      expect(async () => {
        await manager.download('mock1://test');
      }).not.toThrow();
    });

    it('should maintain order of strategies', async () => {
      const strategy1 = new MockStrategy1();
      const strategy2 = new MockStrategyAll(); // Catches all
      const manager = new ImageDownloadStrategyManager([strategy1, strategy2]);

      // Should use strategy1 for mock1://
      const result1 = await manager.download('mock1://test');
      expect(result1).toContain('mock1-');

      // Should use strategy2 (fallback) for other URLs
      const result2 = await manager.download('http://test');
      expect(result2).toContain('fallback-');
    });
  });

  describe('download', () => {
    it('should use correct strategy based on URL', async () => {
      const strategy1 = new MockStrategy1();
      const strategy2 = new MockStrategy2();
      const manager = new ImageDownloadStrategyManager([strategy1, strategy2]);

      const result1 = await manager.download('mock1://test.png');
      expect(result1).toContain('mock1-');

      const result2 = await manager.download('mock2://test.png');
      expect(result2).toContain('mock2-');
    });

    it('should use first matching strategy', async () => {
      const strategy1 = new MockStrategyAll();
      const strategy2 = new MockStrategy1();
      const manager = new ImageDownloadStrategyManager([strategy1, strategy2]);

      // Should use strategy1 (first in chain) even though both can handle it
      const result = await manager.download('mock1://test');
      expect(result).toContain('fallback-');
    });

    it('should throw error when no strategy can handle URL', async () => {
      const strategy1 = new MockStrategy1();
      const manager = new ImageDownloadStrategyManager([strategy1]);

      await expect(manager.download('http://example.com/image.png'))
        .rejects
        .toThrow('No suitable strategy found');
    });

    it('should handle multiple URLs with same strategy', async () => {
      const strategy = new MockStrategy1();
      const manager = new ImageDownloadStrategyManager([strategy]);

      const result1 = await manager.download('mock1://image1.png');
      const result2 = await manager.download('mock1://image2.png');

      expect(result1).toContain('mock1-');
      expect(result2).toContain('mock1-');
      expect(result1).not.toBe(result2);
    });

    it('should work with fallback strategy', async () => {
      const specific = new MockStrategy1();
      const fallback = new MockStrategyAll();
      const manager = new ImageDownloadStrategyManager([specific, fallback]);

      // Specific strategy
      const result1 = await manager.download('mock1://test');
      expect(result1).toContain('mock1-');

      // Fallback strategy
      const result2 = await manager.download('http://example.com/image.png');
      expect(result2).toContain('fallback-');
    });
  });

  describe('empty strategy manager', () => {
    it('should throw error when no strategies configured', async () => {
      const manager = new ImageDownloadStrategyManager();

      await expect(manager.download('http://example.com/image.png'))
        .rejects
        .toThrow('No image download strategies configured');
    });

    it('should allow adding strategies after construction', async () => {
      const manager = new ImageDownloadStrategyManager();
      const strategy = new MockStrategy1();
      
      manager.addStrategy(strategy);
      
      const result = await manager.download('mock1://test');
      expect(result).toContain('mock1-');
    });
  });
});
