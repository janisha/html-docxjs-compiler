import { ExternalHyperlink, TextRun } from 'docx';
import { handleA } from '../../../src/handlers/anchor.handler';
import { IHtmlElement } from '../../../src/handlers/models';

describe('Anchor Handler', () => {
  describe('handleA', () => {
    it('should create a hyperlink with text', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'a',
        attribs: { href: 'https://example.com' },
        children: [
          {
            type: 'text',
            data: 'Click here',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleA(element);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExternalHyperlink);
    });

    it('should handle links with inline formatting', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'a',
        attribs: { href: 'https://example.com' },
        children: [
          {
            type: 'tag',
        data: "",
            name: 'strong',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Bold Link',
                name: '',
                attribs: {},
                children: []
              }
            ]
          }
        ]
      };

      const result = await handleA(element);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExternalHyperlink);
    });

    it('should merge parent styles with element styles', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'a',
        attribs: { 
          href: 'https://example.com',
          style: 'color: blue'
        },
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

      const parentStyles = { bold: true };
      const result = await handleA(element, parentStyles);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExternalHyperlink);
    });

    it('should handle empty href', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'a',
        attribs: { href: '' },
        children: [
          {
            type: 'text',
            data: 'Empty Link',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleA(element);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExternalHyperlink);
    });

    it('should handle complex nested content', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'a',
        attribs: { href: 'https://example.com' },
        children: [
          {
            type: 'text',
            data: 'Link with ',
            name: '',
            attribs: {},
            children: []
          },
          {
            type: 'tag',
        data: "",
            name: 'em',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'italic',
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

      const result = await handleA(element);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExternalHyperlink);
    });
  });
});
