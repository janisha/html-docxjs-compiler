import { handleP } from '../../../src/handlers/paragraph.handler';
import { Paragraph } from 'docx';

describe('Paragraph Handler', () => {
  it('should create paragraph from simple text', async () => {
    const element: any = {
      name: 'p',
      type: 'tag',
      attribs: {},
      children: [{
        type: 'text',
        data: 'Hello World'
      }]
    };

    const result = await handleP(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Paragraph);
  });

  it('should handle paragraph with inline formatting', async () => {
    const element: any = {
      name: 'p',
      type: 'tag',
      attribs: {},
      children: [
        { type: 'text', data: 'Normal ' },
        {
          type: 'tag',
          name: 'strong',
          attribs: {},
          children: [{ type: 'text', data: 'bold' }]
        }
      ]
    };

    const result = await handleP(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Paragraph);
  });

  it('should handle paragraph with text-align style', async () => {
    const element: any = {
      name: 'p',
      type: 'tag',
      attribs: {
        style: 'text-align: center'
      },
      children: [{
        type: 'text',
        data: 'Centered text'
      }]
    };

    const result = await handleP(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Paragraph);
  });

  it('should handle empty paragraph', async () => {
    const element: any = {
      name: 'p',
      type: 'tag',
      attribs: {},
      children: []
    };

    const result = await handleP(element, 0, {});

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Paragraph);
  });

  it('should inherit parent styles', async () => {
    const element: any = {
      name: 'p',
      type: 'tag',
      attribs: {},
      children: [{
        type: 'text',
        data: 'Styled text'
      }]
    };

    const parentStyles = {
      color: 'FF0000',
      bold: true
    };

    const result = await handleP(element, 0, parentStyles);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Paragraph);
  });

  it('should handle multiple alignment values', async () => {
    const alignments = ['left', 'center', 'right', 'justify'];

    for (const align of alignments) {
      const element: any = {
        name: 'p',
        type: 'tag',
        attribs: {
          style: `text-align: ${align}`
        },
        children: [{ type: 'text', data: 'Text' }]
      };

      const result = await handleP(element, 0, {});
      expect(result).toHaveLength(1);
    }
  });
});
