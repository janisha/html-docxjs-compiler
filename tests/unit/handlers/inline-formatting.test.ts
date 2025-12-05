import { handleStrong } from '../../../src/handlers/strong.handler';
import { handleI } from '../../../src/handlers/italic.handler';
import { handleU } from '../../../src/handlers/underline.handler';
import { handleStriked } from '../../../src/handlers/striked.helper';
import { handleSub } from '../../../src/handlers/sub.helper';
import { handleSup } from '../../../src/handlers/sup.helper';
import { handleSpan } from '../../../src/handlers/span.handler';

describe('Inline Formatting Handlers', () => {
  describe('Strong/Bold Handler', () => {
    it('should handle bold text', async () => {
      const element: any = {
        name: 'strong',
        type: 'tag',
        attribs: {},
        children: [{ type: 'text', data: 'Bold text' }]
      };

      const result = await handleStrong(element, {});

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle nested formatting', async () => {
      const element: any = {
        name: 'strong',
        type: 'tag',
        attribs: {},
        children: [{
          name: 'em',
          type: 'tag',
          attribs: {},
          children: [{ type: 'text', data: 'Bold and italic' }]
        }]
      };

      const result = await handleStrong(element, {});

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Italic Handler', () => {
    it('should handle italic text', async () => {
      const element: any = {
        name: 'em',
        type: 'tag',
        attribs: {},
        children: [{ type: 'text', data: 'Italic text' }]
      };

      const result = await handleI(element, {});

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Underline Handler', () => {
    it('should handle underlined text', async () => {
      const element: any = {
        name: 'u',
        type: 'tag',
        attribs: {},
        children: [{ type: 'text', data: 'Underlined text' }]
      };

      const result = await handleU(element, {});

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Strikethrough Handler', () => {
    it('should handle strikethrough text', async () => {
      const element: any = {
        name: 's',
        type: 'tag',
        attribs: {},
        children: [{ type: 'text', data: 'Strikethrough text' }]
      };

      const result = await handleStriked(element, {});

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Subscript Handler', () => {
    it('should handle subscript text', async () => {
      const element: any = {
        name: 'sub',
        type: 'tag',
        attribs: {},
        children: [{ type: 'text', data: '2' }]
      };

      const result = await handleSub(element, {});

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Superscript Handler', () => {
    it('should handle superscript text', async () => {
      const element: any = {
        name: 'sup',
        type: 'tag',
        attribs: {},
        children: [{ type: 'text', data: '2' }]
      };

      const result = await handleSup(element, {});

      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Span Handler', () => {
    it('should handle span with color', async () => {
      const element: any = {
        name: 'span',
        type: 'tag',
        attribs: {
          style: 'color: red'
        },
        children: [{ type: 'text', data: 'Colored text' }]
      };

      const result = await handleSpan(element, {});

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle span with background color', async () => {
      const element: any = {
        name: 'span',
        type: 'tag',
        attribs: {
          style: 'background-color: yellow'
        },
        children: [{ type: 'text', data: 'Highlighted text' }]
      };

      const result = await handleSpan(element, {});

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
