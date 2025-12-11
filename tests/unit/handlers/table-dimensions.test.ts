import {
  getTableWidth,
  getElementWidth,
  countColumnsInRow,
  getColumnCount,
  getTableInfo,
} from '../../../src/handlers/table/table-dimensions';

// Use 'any' type for test elements to avoid needing all IHtmlElement properties

describe('Table Dimensions', () => {
  describe('getTableWidth', () => {
    it('should return 0 when no width is defined', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [],
      };

      expect(getTableWidth(table)).toBe(0);
    });

    it('should parse pixel width from style', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {
          style: 'width: 600px;',
        },
        children: [],
      };

      expect(getTableWidth(table)).toBe(600);
    });

    it('should parse point width from style and convert to pixels', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {
          style: 'width: 450pt;',
        },
        children: [],
      };

      // 450pt * 1.333333 = 600px (rounded)
      expect(getTableWidth(table)).toBe(600);
    });

    it('should return 0 for percentage width in style', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {
          style: 'width: 100%;',
        },
        children: [],
      };

      expect(getTableWidth(table)).toBe(0);
    });

    it('should parse pixel width from width attribute', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {
          width: '500',
        },
        children: [],
      };

      expect(getTableWidth(table)).toBe(500);
    });

    it('should return 0 for percentage width in attribute', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {
          width: '80%',
        },
        children: [],
      };

      expect(getTableWidth(table)).toBe(0);
    });

    it('should prioritize style over width attribute', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {
          style: 'width: 700px;',
          width: '500',
        },
        children: [],
      };

      expect(getTableWidth(table)).toBe(700);
    });
  });

  describe('getElementWidth', () => {
    it('should return 0 width when no width is defined', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {},
        children: [],
      };

      const result = getElementWidth(element, 600);

      expect(result).toEqual({ width: 0, type: 'dxa' });
    });

    it('should calculate percentage width from style', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'width: 50%;',
        },
        children: [],
      };

      const result = getElementWidth(element, 600);

      // TABLE_WIDTH_DXA is 9200, so 50% = 4600
      expect(result.type).toBe('dxa');
      expect(result.width).toBe(4600);
    });

    it('should calculate pixel width from style relative to table width', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'width: 300px;',
        },
        children: [],
      };

      const result = getElementWidth(element, 600);

      // 300/600 = 50%, 50% of 9200 = 4600
      expect(result.type).toBe('dxa');
      expect(result.width).toBe(4600);
    });

    it('should calculate point width from style', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'width: 225pt;',
        },
        children: [],
      };

      const result = getElementWidth(element, 600);

      // 225pt * 1.333333 = 300px, 300/600 = 50%, 50% of 9200 = 4600
      expect(result.type).toBe('dxa');
      expect(result.width).toBe(4600);
    });

    it('should return 0 width for pixel style when table width is 0', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'width: 300px;',
        },
        children: [],
      };

      const result = getElementWidth(element, 0);

      expect(result).toEqual({ width: 0, type: 'dxa' });
    });

    it('should calculate percentage width from attribute', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          width: '25%',
        },
        children: [],
      };

      const result = getElementWidth(element, 600);

      // 25% of 9200 = 2300
      expect(result.type).toBe('dxa');
      expect(result.width).toBe(2300);
    });

    it('should calculate pixel width from attribute', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          width: '200',
        },
        children: [],
      };

      const result = getElementWidth(element, 600);

      // 200/600 = 33.33%, 33.33% of 9200 ≈ 3066.67
      expect(result.type).toBe('dxa');
      expect(result.width).toBeCloseTo(3066.67, 1);
    });

    it('should return 0 width for pixel attribute when table width is 0', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          width: '200',
        },
        children: [],
      };

      const result = getElementWidth(element, 0);

      expect(result).toEqual({ width: 0, type: 'dxa' });
    });

    it('should include rowspan when defined', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'width: 50%;',
          rowspan: '2',
        },
        children: [],
      };

      const result = getElementWidth(element, 600);

      expect(result).toEqual({
        width: 4600,
        type: 'dxa',
        rowspan: 2,
      });
    });

    it('should not include rowspan when it is 1', () => {
      const element: any = {
        name: 'td',
        type: 'tag',
        attribs: {
          style: 'width: 50%;',
          rowspan: '1',
        },
        children: [],
      };

      const result = getElementWidth(element, 600);

      expect(result).toEqual({
        width: 4600,
        type: 'dxa',
      });
    });
  });

  describe('countColumnsInRow', () => {
    it('should count simple columns', () => {
      const row: any = {
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [
          { name: 'td', type: 'tag', attribs: {}, children: [] },
          { name: 'td', type: 'tag', attribs: {}, children: [] },
          { name: 'td', type: 'tag', attribs: {}, children: [] },
        ],
      };

      expect(countColumnsInRow(row)).toBe(3);
    });

    it('should count columns with colspan', () => {
      const row: any = {
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [
          { name: 'td', type: 'tag', attribs: { colspan: '2' }, children: [] },
          { name: 'td', type: 'tag', attribs: {}, children: [] },
        ],
      };

      // 2 (colspan) + 1 (simple) = 3
      expect(countColumnsInRow(row)).toBe(3);
    });

    it('should count th elements', () => {
      const row: any = {
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [
          { name: 'th', type: 'tag', attribs: {}, children: [] },
          { name: 'th', type: 'tag', attribs: { colspan: '3' }, children: [] },
        ],
      };

      // 1 (simple th) + 3 (colspan) = 4
      expect(countColumnsInRow(row)).toBe(4);
    });

    it('should count mixed td and th elements', () => {
      const row: any = {
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [
          { name: 'th', type: 'tag', attribs: {}, children: [] },
          { name: 'td', type: 'tag', attribs: { colspan: '2' }, children: [] },
          { name: 'td', type: 'tag', attribs: {}, children: [] },
        ],
      };

      // 1 (th) + 2 (td colspan) + 1 (td) = 4
      expect(countColumnsInRow(row)).toBe(4);
    });

    it('should return 0 for empty row', () => {
      const row: any = {
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [],
      };

      expect(countColumnsInRow(row)).toBe(0);
    });
  });

  describe('getColumnCount', () => {
    it('should return 0 for empty table', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [],
      };

      expect(getColumnCount(table)).toBe(0);
    });

    it('should count columns from direct tr element', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'tr',
            type: 'tag',
            attribs: {},
            children: [
              { name: 'td', type: 'tag', attribs: {}, children: [] },
              { name: 'td', type: 'tag', attribs: {}, children: [] },
            ],
          },
        ],
      };

      expect(getColumnCount(table)).toBe(2);
    });

    it('should count columns from thead', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'thead',
            type: 'tag',
            attribs: {},
            children: [
              {
                name: 'tr',
                type: 'tag',
                attribs: {},
                children: [
                  { name: 'th', type: 'tag', attribs: {}, children: [] },
                  { name: 'th', type: 'tag', attribs: {}, children: [] },
                  { name: 'th', type: 'tag', attribs: {}, children: [] },
                ],
              },
            ],
          },
        ],
      };

      expect(getColumnCount(table)).toBe(3);
    });

    it('should count columns from tbody', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'tbody',
            type: 'tag',
            attribs: {},
            children: [
              {
                name: 'tr',
                type: 'tag',
                attribs: {},
                children: [
                  { name: 'td', type: 'tag', attribs: {}, children: [] },
                  { name: 'td', type: 'tag', attribs: {}, children: [] },
                  { name: 'td', type: 'tag', attribs: {}, children: [] },
                  { name: 'td', type: 'tag', attribs: {}, children: [] },
                ],
              },
            ],
          },
        ],
      };

      expect(getColumnCount(table)).toBe(4);
    });

    it('should return 0 for thead with no rows', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'thead',
            type: 'tag',
            attribs: {},
            children: [],
          },
        ],
      };

      expect(getColumnCount(table)).toBe(0);
    });

    it('should return 0 for tbody with no rows', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'tbody',
            type: 'tag',
            attribs: {},
            children: [],
          },
        ],
      };

      expect(getColumnCount(table)).toBe(0);
    });

    it('should handle colspan in first row', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [
          {
            name: 'tr',
            type: 'tag',
            attribs: {},
            children: [
              { name: 'td', type: 'tag', attribs: { colspan: '3' }, children: [] },
              { name: 'td', type: 'tag', attribs: {}, children: [] },
            ],
          },
        ],
      };

      expect(getColumnCount(table)).toBe(4);
    });
  });

  describe('getTableInfo', () => {
    it('should return table info with width and column count', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {
          style: 'width: 600px;',
        },
        children: [
          {
            name: 'tr',
            type: 'tag',
            attribs: {},
            children: [
              { name: 'td', type: 'tag', attribs: {}, children: [] },
              { name: 'td', type: 'tag', attribs: {}, children: [] },
              { name: 'td', type: 'tag', attribs: {}, children: [] },
            ],
          },
        ],
      };

      const result = getTableInfo(table);

      expect(result).toEqual({
        numberOfColumns: 3,
        tableWidth: 600,
        hasAnyWidthDefined: false,
        columnSizes: [],
      });
    });

    it('should return default values for empty table', () => {
      const table: any = {
        name: 'table',
        type: 'tag',
        attribs: {},
        children: [],
      };

      const result = getTableInfo(table);

      expect(result).toEqual({
        numberOfColumns: 0,
        tableWidth: 0,
        hasAnyWidthDefined: false,
        columnSizes: [],
      });
    });
  });
});
