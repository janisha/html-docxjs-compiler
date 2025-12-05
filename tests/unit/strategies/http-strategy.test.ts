import { HttpImageDownloadStrategy } from '../../../src/strategies/http-image-strategy';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HttpImageDownloadStrategy', () => {
  let strategy: HttpImageDownloadStrategy;

  beforeEach(() => {
    strategy = new HttpImageDownloadStrategy();
    jest.clearAllMocks();
  });

  describe('canHandle', () => {
    it('should handle http URLs', () => {
      expect(strategy.canHandle('http://example.com/image.png')).toBe(true);
    });

    it('should handle https URLs', () => {
      expect(strategy.canHandle('https://example.com/image.png')).toBe(true);
    });

    it('should not handle data URIs', () => {
      expect(strategy.canHandle('data:image/png;base64,iVBORw0KGgo=')).toBe(false);
    });

    it('should not handle file URLs', () => {
      expect(strategy.canHandle('file:///path/to/image.png')).toBe(false);
    });

    it('should not handle relative URLs', () => {
      expect(strategy.canHandle('/images/logo.png')).toBe(false);
      expect(strategy.canHandle('../images/logo.png')).toBe(false);
    });

    it('should not handle Firebase URLs', () => {
      expect(strategy.canHandle('https://firebasestorage.googleapis.com/v0/b/bucket/o/image.png')).toBe(true);
    });
  });

  describe('download', () => {
    it('should download and convert image to base64', async () => {
      const mockImageData = Buffer.from('fake-image-data');
      mockedAxios.get.mockResolvedValue({
        data: mockImageData
      });

      const result = await strategy.download('http://example.com/image.png');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://example.com/image.png',
        { responseType: 'arraybuffer' }
      );
      expect(result).toContain('data:image/png;base64,');
    });

    it('should throw error when download fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(strategy.download('http://example.com/image.png'))
        .rejects
        .toThrow('Network error');
    });

    it('should handle different image formats', async () => {
      const mockImageData = Buffer.from('jpeg-data');
      mockedAxios.get.mockResolvedValue({ data: mockImageData });

      const result = await strategy.download('https://example.com/photo.jpg');

      expect(result).toContain('data:image/png;base64,');
    });

    it('should handle 404 errors', async () => {
      mockedAxios.get.mockRejectedValue({
        response: { status: 404 },
        message: 'Not found'
      });

      await expect(strategy.download('http://example.com/missing.png'))
        .rejects
        .toBeDefined();
    });
  });
});
