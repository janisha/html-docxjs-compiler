import { handleTable } from '../../../src/handlers/table';
import { Table } from 'docx';

describe('Table Handler', () => {
  it('should create table from simple HTML table', async () => {
    const element: any = {
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
              children: [{ type: 'text', data: 'Cell 1' }]
            },
            {
              name: 'td',
              type: 'tag',
              attribs: {},
              children: [{ type: 'text', data: 'Cell 2' }]
            }
          ]
        }
      ]
    };

    const result = await handleTable(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Table);
  });

  it('should handle table with thead and tbody', async () => {
    const element: any = {
      name: 'table',
      type: 'tag',
      attribs: {},
      children: [
        {
          name: 'thead',
          type: 'tag',
          attribs: {},
          children: [{
            name: 'tr',
            type: 'tag',
            attribs: {},
            children: [
              {
                name: 'th',
                type: 'tag',
                attribs: {},
                children: [{ type: 'text', data: 'Header' }]
              }
            ]
          }]
        },
        {
          name: 'tbody',
          type: 'tag',
          attribs: {},
          children: [{
            name: 'tr',
            type: 'tag',
            attribs: {},
            children: [
              {
                name: 'td',
                type: 'tag',
                attribs: {},
                children: [{ type: 'text', data: 'Data' }]
              }
            ]
          }]
        }
      ]
    };

    const result = await handleTable(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Table);
  });

  it('should handle table with colspan', async () => {
    const element: any = {
      name: 'table',
      type: 'tag',
      attribs: {},
      children: [{
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [{
          name: 'td',
          type: 'tag',
          attribs: { colspan: '2' },
          children: [{ type: 'text', data: 'Spanning cell' }]
        }]
      }]
    };

    const result = await handleTable(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Table);
  });

  it('should handle table with rowspan', async () => {
    const element: any = {
      name: 'table',
      type: 'tag',
      attribs: {},
      children: [
        {
          name: 'tr',
          type: 'tag',
          attribs: {},
          children: [{
            name: 'td',
            type: 'tag',
            attribs: { rowspan: '2' },
            children: [{ type: 'text', data: 'Spanning cell' }]
          }]
        },
        {
          name: 'tr',
          type: 'tag',
          attribs: {},
          children: [{
            name: 'td',
            type: 'tag',
            attribs: {},
            children: [{ type: 'text', data: 'Cell' }]
          }]
        }
      ]
    };

    const result = await handleTable(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Table);
  });

  it('should handle table with cell styling', async () => {
    const element: any = {
      name: 'table',
      type: 'tag',
      attribs: {},
      children: [{
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [{
          name: 'td',
          type: 'tag',
          attribs: {
            style: 'background-color: #FF0000; text-align: center; vertical-align: middle'
          },
          children: [{ type: 'text', data: 'Styled cell' }]
        }]
      }]
    };

    const result = await handleTable(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Table);
  });

  it('should handle empty table', async () => {
    const element: any = {
      name: 'table',
      type: 'tag',
      attribs: {},
      children: []
    };

    const result = await handleTable(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Table);
  });

  it('should handle nested content in cells', async () => {
    const element: any = {
      name: 'table',
      type: 'tag',
      attribs: {},
      children: [{
        name: 'tr',
        type: 'tag',
        attribs: {},
        children: [{
          name: 'td',
          type: 'tag',
          attribs: {},
          children: [
            {
              name: 'p',
              type: 'tag',
              attribs: {},
              children: [{ type: 'text', data: 'Paragraph in cell' }]
            }
          ]
        }]
      }]
    };

    const result = await handleTable(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Table);
  });
});
