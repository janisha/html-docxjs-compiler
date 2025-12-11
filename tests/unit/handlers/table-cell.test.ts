import { createTableCell } from '../../../src/handlers/table/table-cell';
import { TableCell } from 'docx';

describe('Table Cell Handler', () => {
  describe('createTableCell', () => {
    it('should create a cell with empty paragraph for empty cell', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should create a cell with text content', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Hello World',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle colspan attribute', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          colspan: '3',
        },
        children: [
          {
            type: 'text',
            data: 'Spanned cell',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle rowspan attribute', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          rowspan: '2',
        },
        children: [
          {
            type: 'text',
            data: 'Rowspan cell',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle both colspan and rowspan', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          colspan: '2',
          rowspan: '3',
        },
        children: [
          {
            type: 'text',
            data: 'Complex span',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle vertical-align style', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'vertical-align: middle;',
        },
        children: [
          {
            type: 'text',
            data: 'Vertically aligned',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle background-color style', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'background-color: #FF0000;',
        },
        children: [
          {
            type: 'text',
            data: 'Red background',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle text-align style', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'text-align: center;',
        },
        children: [
          {
            type: 'text',
            data: 'Centered text',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle multiple styles together', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'text-align: right; vertical-align: top; background-color: #00FF00;',
          colspan: '2',
        },
        children: [
          {
            type: 'text',
            data: 'Styled cell',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle single inline element child', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'strong',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Bold text',
              },
            ],
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle single block element child (paragraph)', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'p',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Paragraph text',
              },
            ],
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle nested table', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'table',
            type: 'tag',
            attribs: {},
            children: [
              {
                name: 'tr',
                type: 'tag',
                attribs: {},
                children: [
                  {
                    name: 'td',
                    type: 'tag',
                    attribs: {},
                    children: [
                      {
                        type: 'text',
                        data: 'Nested',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle multiple child elements', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'First line',
          },
          {
            name: 'br',
            type: 'tag',
            attribs: {},
            children: [],
          },
          {
            type: 'text',
            data: 'Second line',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle mixed inline and block elements', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Text before',
          },
          {
            name: 'p',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Paragraph',
              },
            ],
          },
          {
            type: 'text',
            data: 'Text after',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should filter out empty text nodes', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            type: 'text',
            data: '   ',
          },
          {
            name: 'strong',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Important',
              },
            ],
          },
          {
            type: 'text',
            data: '\n\t',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle th element', async () => {
      const element: any = {
        name: 'th',
        type: 'tag',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Header cell',
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should pass inherited styles to children', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Styled text',
          },
        ],
      };

      const inheritedStyles = {
        bold: true,
        italics: true,
      };

      const result = await createTableCell(element, 0, inheritedStyles, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should merge cell styles with inherited styles', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'text-align: center;',
        },
        children: [
          {
            type: 'text',
            data: 'Centered and bold',
          },
        ],
      };

      const inheritedStyles = {
        bold: true,
      };

      const result = await createTableCell(element, 0, inheritedStyles, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle cell with config options', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            type: 'text',
            data: 'Cell with config',
          },
        ],
      };

      const config = {
        strategyManager: undefined,
      };

      const result = await createTableCell(element, 0, {}, 600, config);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle complex nested structure', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'vertical-align: bottom; background-color: #EFEFEF;',
          rowspan: '2',
        },
        children: [
          {
            name: 'strong',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Bold',
              },
            ],
          },
          {
            type: 'text',
            data: ' and ',
          },
          {
            name: 'em',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'italic',
              },
            ],
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });

    it('should handle line block elements in multiple children', async () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'span',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'First span',
              },
            ],
          },
          {
            name: 'br',
            type: 'tag',
            attribs: {},
            children: [],
          },
          {
            name: 'span',
            type: 'tag',
            attribs: {},
            children: [
              {
                type: 'text',
                data: 'Second span',
              },
            ],
          },
        ],
      };

      const result = await createTableCell(element, 0, {}, 600);

      expect(result).toBeInstanceOf(TableCell);
    });
  });
});
