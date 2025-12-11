import { Paragraph, HeadingLevel } from 'docx';
import { handleH123456 } from '../../../src/handlers/header.handler';
import { IHtmlElement } from '../../../src/handlers/models';

describe('Header Handler', () => {
  describe('handleH123456', () => {
    it('should create h1 heading', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h1',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Heading 1',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should create h2 heading', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h2',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Heading 2',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should create h3 heading', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h3',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Heading 3',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should create h4 heading', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h4',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Heading 4',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should create h5 heading', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h5',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Heading 5',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should create h6 heading', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h6',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Heading 6',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle headings with styles', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h1',
        attribs: {
          style: 'color: blue'
        },
        children: [
          {
            type: 'text',
            data: 'Styled Heading',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle headings with multiple text children', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h2',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Part 1 ',
            name: '',
            attribs: {},
            children: []
          },
          {
            type: 'tag',
        data: "",
            name: 'span',
            attribs: {},
            children: []
          },
          {
            type: 'text',
            data: 'Part 2',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should merge parent styles with header styles', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h1',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Heading',
            name: '',
            attribs: {},
            children: []
          }
        ]
      };

      const parentStyles = { bold: true };
      const result = await handleH123456(element, 0, parentStyles);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle empty heading', async () => {
      const element: IHtmlElement = {
        type: 'tag',
        data: "",
        name: 'h1',
        attribs: {},
        children: []
      };

      const result = await handleH123456(element, 0);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });
  });
});
