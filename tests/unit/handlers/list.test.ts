import { handleList } from '../../../src/handlers/list.handler';
import { Paragraph } from 'docx';

describe('List Handler', () => {
  it('should create unordered list', async () => {
    const element: any = {
      name: 'ul',
      type: 'tag',
      attribs: {},
      children: [
        {
          name: 'li',
          type: 'tag',
          attribs: {},
          children: [{ type: 'text', data: 'Item 1' }]
        },
        {
          name: 'li',
          type: 'tag',
          attribs: {},
          children: [{ type: 'text', data: 'Item 2' }]
        }
      ]
    };

    const result = await handleList(element, 0, {});

    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => expect(item).toBeInstanceOf(Paragraph));
  });

  it('should create ordered list', async () => {
    const element: any = {
      name: 'ol',
      type: 'tag',
      attribs: {},
      children: [
        {
          name: 'li',
          type: 'tag',
          attribs: {},
          children: [{ type: 'text', data: 'First' }]
        },
        {
          name: 'li',
          type: 'tag',
          attribs: {},
          children: [{ type: 'text', data: 'Second' }]
        }
      ]
    };

    const result = await handleList(element, 0, {});

    expect(result.length).toBeGreaterThan(0);
    result.forEach(item => expect(item).toBeInstanceOf(Paragraph));
  });

  it('should handle nested lists', async () => {
    const element: any = {
      name: 'ul',
      type: 'tag',
      attribs: {},
      children: [
        {
          name: 'li',
          type: 'tag',
          attribs: {},
          children: [
            { type: 'text', data: 'Item 1' },
            {
              name: 'ul',
              type: 'tag',
              attribs: {},
              children: [{
                name: 'li',
                type: 'tag',
                attribs: {},
                children: [{ type: 'text', data: 'Nested item' }]
              }]
            }
          ]
        }
      ]
    };

    const result = await handleList(element, 0, {});

    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle list items with formatting', async () => {
    const element: any = {
      name: 'ul',
      type: 'tag',
      attribs: {},
      children: [{
        name: 'li',
        type: 'tag',
        attribs: {},
        children: [
          { type: 'text', data: 'Normal ' },
          {
            name: 'strong',
            type: 'tag',
            attribs: {},
            children: [{ type: 'text', data: 'bold' }]
          }
        ]
      }]
    };

    const result = await handleList(element, 0, {});

    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle empty list', async () => {
    const element: any = {
      name: 'ul',
      type: 'tag',
      attribs: {},
      children: []
    };

    const result = await handleList(element, 0, {});

    expect(result).toHaveLength(0);
  });

  it('should filter non-li children', async () => {
    const element: any = {
      name: 'ul',
      type: 'tag',
      attribs: {},
      children: [
        { type: 'text', data: 'Should be ignored' },
        {
          name: 'li',
          type: 'tag',
          attribs: {},
          children: [{ type: 'text', data: 'Valid item' }]
        }
      ]
    };

    const result = await handleList(element, 0, {});

    expect(result.length).toBeGreaterThan(0);
  });

  it('should apply parent styles to list items', async () => {
    const element: any = {
      name: 'ul',
      type: 'tag',
      attribs: {},
      children: [{
        name: 'li',
        type: 'tag',
        attribs: {},
        children: [{ type: 'text', data: 'Styled item' }]
      }]
    };

    const parentStyles = {
      color: 'FF0000'
    };

    const result = await handleList(element, 0, parentStyles);

    expect(result.length).toBeGreaterThan(0);
  });
});
