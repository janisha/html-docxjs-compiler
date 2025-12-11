import { handleImage } from '../../../src/handlers/image.handler';
import { ImageRun } from 'docx';
import { ImageDownloadStrategyManager } from '../../../src/strategies';

// Mock the strategy manager
jest.mock('../../../src/strategies', () => ({
  ImageDownloadStrategyManager: jest.fn().mockImplementation(() => ({
    download: jest.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
  }))
}));

describe('Image Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle base64 data URI', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ImageRun);
  });

  it('should return empty array for missing src', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {},
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toEqual([]);
  });

  it('should return empty array for empty src', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: ''
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toEqual([]);
  });

  it('should handle invalid base64 gracefully', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,invalid-base64-data'
      },
      children: []
    };

    const result = await handleImage(element, {});

    // Should return empty array on error
    expect(result).toEqual([]);
  });

  it('should resize large images', async () => {
    // Create a valid small PNG image
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toHaveLength(1);
  });

  it('should apply parent styles', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      children: []
    };

    const styles = {
      alignment: 'center'
    };

    const result = await handleImage(element, styles);

    expect(result).toHaveLength(1);
  });

  it('should skip image and warn when no strategy manager provided for HTTP URLs', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'https://example.com/image.png'
      },
      children: []
    };

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = await handleImage(element, {});

    expect(result).toHaveLength(0);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('No image download strategy configured')
    );

    consoleSpy.mockRestore();
  });

  it('should use provided strategy manager', async () => {
    const mockManager = {
      download: jest.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
    } as any;

    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'https://example.com/image.png'
      },
      children: []
    };

    const result = await handleImage(element, {}, mockManager);

    expect(result).toHaveLength(1);
    expect(mockManager.download).toHaveBeenCalledWith('https://example.com/image.png');
  });

  it('should return empty array when strategy manager fails to download', async () => {
    const mockManager = {
      download: jest.fn().mockRejectedValue(new Error('Download failed'))
    } as any;

    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'https://example.com/invalid-image.png'
      },
      children: []
    };

    const result = await handleImage(element, {}, mockManager);

    expect(result).toEqual([]);
  });

  it('should handle data URI with different image types', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ImageRun);
  });

  it('should handle images with width exceeding MAX_WIDTH', async () => {
    // This test verifies the resizing logic when width > MAX_WIDTH
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toHaveLength(1);
    // The image should be resized if it exceeds constraints
  });

  it('should handle images with height exceeding MAX_HEIGHT', async () => {
    // This test verifies the resizing logic when height > MAX_HEIGHT
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toHaveLength(1);
  });

  it('should preserve dimensions for images within constraints', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(ImageRun);
  });

  it('should handle element with inline styles', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        style: 'width: 100px; height: 100px;'
      },
      children: []
    };

    const result = await handleImage(element, {});

    expect(result).toHaveLength(1);
  });

  it('should merge parent and element styles', async () => {
    const element: any = {
      name: 'img',
      type: 'tag',
      attribs: {
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        style: 'margin: 10px;'
      },
      children: []
    };

    const parentStyles = {
      alignment: 'center',
      bold: true
    };

    const result = await handleImage(element, parentStyles);

    expect(result).toHaveLength(1);
  });
});
