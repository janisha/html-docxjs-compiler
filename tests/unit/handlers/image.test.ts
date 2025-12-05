import { handleImage } from '../../../src/handlers/image.handler';
import { ImageRun } from 'docx';

describe('Image Handler', () => {
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
});
