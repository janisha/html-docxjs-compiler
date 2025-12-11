import { Paragraph } from 'docx';
import { handleTag } from '../../../src/handlers/tag.helper';
import { IHtmlElement } from '../../../src/handlers/models';

describe('Tag Helper', () => {
  describe('handleTag', () => {
    it('should handle div element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Content',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle paragraph element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'p',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Paragraph',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle anchor element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'a',
        attribs: { href: 'https://example.com' },
        children: [
          {
            type: 'text',
            data: 'Link',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle ordered list', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'ol',
        attribs: {},
        children: [
          {
            type: 'tag',
        data: "",
            name: 'li',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Item 1',
                name: '',
                attribs: {},
                children: []
              }
            ]
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle unordered list', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'ul',
        attribs: {},
        children: [
          {
            type: 'tag',
        data: "",
            name: 'li',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Item 1',
                name: '',
                attribs: {},
                children: []
              }
            ]
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle strong/bold elements', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'strong',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Bold',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle italic elements', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'em',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Italic',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle underline element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'u',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Underlined',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle strikethrough element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 's',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Striked',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle superscript element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'sup',
        attribs: {},
        children: [
          {
            type: 'text',
            data: '2',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle subscript element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'sub',
        attribs: {},
        children: [
          {
            type: 'text',
            data: '2',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle br element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'br',
        attribs: {},
        children: []
      };

      const result = await handleTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle all heading levels', async () => {
      for (let i = 1; i <= 6; i++) {
        const element: IHtmlElement = {
          type: 'tag',
        data: "",
          name: `h${i}`,
          attribs: {},
          children: [
            {
              type: 'text',
              data: `Heading ${i}`,
              name: '',
              attribs: {},
              children: []
            }
          ]
        };

        const result = await handleTag(element);
        
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBeInstanceOf(Paragraph);
      }
    });

    it('should return empty array for unknown tag', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'unknown',
        attribs: {},
        children: []
      };

      const result = await handleTag(element);
      
      expect(result).toEqual([]);
    });

    it('should pass level parameter correctly', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'ul',
        attribs: {},
        children: [
          {
            type: 'tag',
        data: "",
            name: 'li',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Item',
                name: '',
                attribs: {},
                children: []
              }
            ]
          }
        ]
      };

      const result = await handleTag(element, 2);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should pass styles correctly', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'span',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Text',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const styles = { bold: true };
      const result = await handleTag(element, 0, styles);
      
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
