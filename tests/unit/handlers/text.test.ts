import { TextRun } from 'docx';
import { handleText, processTextElementTag } from '../../../src/handlers/text.handler';
import { IHtmlElement } from '../../../src/handlers/models';

describe('Text Handler', () => {
  describe('handleText', () => {
    it('should handle simple text', () => {
      const element: IHtmlElement = {
        type: 'text',
        data: 'Hello World',
        name: '',
        attribs: {},
        children: []
      };

      const result = handleText(element);
      
      expect(result).toBe('Hello World');
    });

    it('should remove line breaks', () => {
      const element: IHtmlElement = {
        type: 'text',
        data: 'Hello\nWorld',
        name: '',
        attribs: {},
        children: []
      };

      const result = handleText(element);
      
      expect(result).toBe('HelloWorld');
    });

    it('should remove carriage returns', () => {
      const element: IHtmlElement = {
        type: 'text',
        data: 'Hello\rWorld',
        name: '',
        attribs: {},
        children: []
      };

      const result = handleText(element);
      
      expect(result).toBe('HelloWorld');
    });

    it('should remove tabs', () => {
      const element: IHtmlElement = {
        type: 'text',
        data: 'Hello\tWorld',
        name: '',
        attribs: {},
        children: []
      };

      const result = handleText(element);
      
      expect(result).toBe('HelloWorld');
    });

    it('should remove multiple types of whitespace', () => {
      const element: IHtmlElement = {
        type: 'text',
        data: 'Hello\n\r\t\n\tWorld',
        name: '',
        attribs: {},
        children: []
      };

      const result = handleText(element);
      
      expect(result).toBe('HelloWorld');
    });

    it('should handle empty string', () => {
      const element: IHtmlElement = {
        type: 'text',
        data: '',
        name: '',
        attribs: {},
        children: []
      };

      const result = handleText(element);
      
      expect(result).toBe('');
    });

    it('should handle error gracefully', () => {
      const element = {} as IHtmlElement;

      const result = handleText(element);
      
      expect(result).toBe(' ');
    });
  });

  describe('processTextElementTag', () => {
    it('should process text element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'span',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Hello',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await processTextElementTag(element);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(TextRun);
    });

    it('should apply styles to text runs', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'span',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Bold text',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const styles = { bold: true };
      const result = await processTextElementTag(element, styles);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(TextRun);
    });

    it('should handle mixed text and inline elements', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'p',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Normal ',
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
          },
          {
            type: 'text',
            data: ' text',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await processTextElementTag(element);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty element', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'span',
        attribs: {},
        children: []
      };

      const result = await processTextElementTag(element);
      
      expect(result).toHaveLength(0);
    });

    it('should handle errors gracefully', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'span',
        attribs: {},
        children: [null as any]
      };

      const result = await processTextElementTag(element);
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should apply color styles', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'span',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Colored text',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const styles = { color: '#ff0000' };
      const result = await processTextElementTag(element, styles);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(TextRun);
    });
  });
});
