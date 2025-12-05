import { Paragraph } from 'docx';
import { handleDiv } from '../../../src/handlers/div.handler';
import { IHtmlElement } from '../../../src/handlers/models';

describe('Div Handler', () => {
  describe('handleDiv', () => {
    it('should convert div with simple text to paragraph', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Simple text',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleDiv(element, {});
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle div with multiple text nodes', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'First text ',
            name: '',
            attribs: {},
            children: []
          },
          {
            type: 'text',
            data: 'Second text',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleDiv(element, {});
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle div with inline formatting', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Text with ',
            name: '',
            attribs: {},
            children: []
          },
          {
            type: 'tag',
        data: "",
            name: 'strong',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'bold',
                name: '',
                attribs: {},
                children: []
              }
            ]
          }
        ]
      };

      const result = await handleDiv(element, {});
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle div with nested block elements', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {},
        children: [
          {
            type: 'tag',
        data: "",
            name: 'p',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Paragraph 1',
                name: '',
                attribs: {},
                children: []
              }
            ]
          },
          {
            type: 'tag',
        data: "",
            name: 'p',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Paragraph 2',
                name: '',
                attribs: {},
                children: []
              }
            ]
          }
        ]
      };

      const result = await handleDiv(element, {});
      
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should merge parent styles with div styles', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {
          style: 'color: blue'
        },
        children: [
          {
            type: 'text',
            data: 'Styled text',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const parentStyles = { bold: true };
      const result = await handleDiv(element, parentStyles);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle empty div', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {},
        children: []
      };

      const result = await handleDiv(element, {});
      
      // Empty div returns empty array
      expect(result).toHaveLength(0);
    });

    it('should handle div with mixed content (text and block elements)', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'div',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Text before',
            name: '',
            attribs: {},
            children: []
          },
          {
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
          },
          {
            type: 'text',
            data: 'Text after',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleDiv(element, {});
      
      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });
});
