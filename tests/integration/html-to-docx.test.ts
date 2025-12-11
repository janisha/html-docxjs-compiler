import { transformHtmlToDocx, transformHtmlToDocxSimple, textToDocx } from '../../src/services/html-to-word.service';
import { Paragraph, TextRun, Table, ImageRun } from 'docx';

describe('HTML to DOCX Service - Integration Tests', () => {
  describe('transformHtmlToDocx', () => {
    it('should convert simple paragraph to DOCX', async () => {
      const html = '<p>Hello World</p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should convert multiple paragraphs', async () => {
      const html = '<p>First</p><p>Second</p><p>Third</p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(3);
      result.forEach(item => expect(item).toBeInstanceOf(Paragraph));
    });

    it('should handle headings h1-h6', async () => {
      const html = '<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(6);
      result.forEach(item => expect(item).toBeInstanceOf(Paragraph));
    });

    it('should handle inline formatting', async () => {
      const html = '<p>Normal <strong>bold</strong> <em>italic</em> <u>underline</u></p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle nested inline elements', async () => {
      const html = '<p><strong><em>Bold and italic</em></strong></p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should convert unordered list', async () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      `;
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
      result.forEach(item => expect(item).toBeInstanceOf(Paragraph));
    });

    it('should convert ordered list', async () => {
      const html = `
        <ol>
          <li>First</li>
          <li>Second</li>
          <li>Third</li>
        </ol>
      `;
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
      result.forEach(item => expect(item).toBeInstanceOf(Paragraph));
    });

    it('should handle nested lists', async () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2
            <ul>
              <li>Nested 1</li>
              <li>Nested 2</li>
            </ul>
          </li>
          <li>Item 3</li>
        </ul>
      `;
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should convert simple table', async () => {
      const html = `
        <table>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
          <tr>
            <td>Cell 3</td>
            <td>Cell 4</td>
          </tr>
        </table>
      `;
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Table);
    });

    it('should handle table with thead and tbody', async () => {
      const html = `
        <table>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>
      `;
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Table);
    });

    it('should handle div containers', async () => {
      const html = `
        <div>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </div>
      `;
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle links', async () => {
      const html = '<p>Visit <a href="https://example.com">our website</a></p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle br tags', async () => {
      const html = '<p>Line 1<br/>Line 2<br/>Line 3</p>';
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle sub and sup', async () => {
      const html = '<p>H<sub>2</sub>O and E=mc<sup>2</sup></p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle strikethrough', async () => {
      const html = '<p><s>Deleted text</s></p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle complex nested structure', async () => {
      const html = `
        <div>
          <h1>Title</h1>
          <p>Introduction with <strong>bold</strong> and <em>italic</em></p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <table>
            <tr>
              <td>Data</td>
            </tr>
          </table>
        </div>
      `;
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty string', async () => {
      const result = await transformHtmlToDocx('');

      expect(result).toEqual([]);
    });

    it('should return empty array for null input', async () => {
      const result = await transformHtmlToDocx(null as any);

      expect(result).toEqual([]);
    });

    it('should handle plain text without wrapping tags', async () => {
      const html = 'Just plain text';
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle text with special characters', async () => {
      const html = '<p>Special: &amp; &lt; &gt; &quot;</p>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
    });
  });

  describe('transformHtmlToDocxSimple', () => {
    it('should convert simple HTML', async () => {
      const html = '<p>Simple text</p>';
      const result = await transformHtmlToDocxSimple(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should wrap inline elements', async () => {
      const html = '<span>Inline text</span>';
      const result = await transformHtmlToDocxSimple(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty input', async () => {
      const result = await transformHtmlToDocxSimple('');

      expect(result).toEqual([]);
    });
  });

  describe('textToDocx', () => {
    it('should convert plain text', async () => {
      const text = 'Plain text content';
      const result = await textToDocx(text);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should preserve line breaks', async () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const result = await textToDocx(text);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty text', async () => {
      const result = await textToDocx('');

      expect(result).toEqual([]);
    });

    it('should handle text with special characters', async () => {
      const text = 'Text with special chars: & < > "';
      const result = await textToDocx(text);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for empty text', async () => {
      const result = await textToDocx('');
      expect(result).toEqual([]);
    });

    it('should return empty array for null text', async () => {
      const result = await textToDocx(null as any);
      expect(result).toEqual([]);
    });
  });

  describe('transformHtmlToDocx - inline element wrapping', () => {
    it('should wrap inline elements in paragraph', async () => {
      const html = '<strong>Bold text without paragraph</strong>';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle br tags without wrapping', async () => {
      const html = '<p>Line 1</p><br /><p>Line 2</p>';
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle text nodes outside block elements', async () => {
      const html = 'Plain text without tags';
      const result = await transformHtmlToDocx(html);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Paragraph);
    });

    it('should handle mixed inline and block elements', async () => {
      const html = '<p>Block</p><strong>Inline</strong><p>Another block</p>';
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter out empty inline elements', async () => {
      const html = '<span></span><p>Content</p><strong></strong>';
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('transformHtmlToDocxSimple - edge cases', () => {
    it('should handle empty HTML', async () => {
      const result = await transformHtmlToDocxSimple('');
      expect(result).toEqual([]);
    });

    it('should handle null HTML', async () => {
      const result = await transformHtmlToDocxSimple(null as any);
      expect(result).toEqual([]);
    });

    it('should handle plain text without tags', async () => {
      const html = 'Just plain text';
      const result = await transformHtmlToDocxSimple(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle text nodes in simple mode', async () => {
      const html = '<div>Text <strong>bold</strong> more text</div>';
      const result = await transformHtmlToDocxSimple(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty elements in simple mode', async () => {
      const html = '<div><span></span><p></p></div>';
      const result = await transformHtmlToDocxSimple(html);

      expect(result).toBeDefined();
    });
  });

  describe('removeNewLinesSpecialCharacters', () => {
    it('should handle empty string', async () => {
      const html = '';
      const result = await transformHtmlToDocx(html);
      expect(result).toEqual([]);
    });

    it('should handle HTML with trailing newlines', async () => {
      const html = '<p>Content</p>\n\n\n';
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle HTML with tabs', async () => {
      const html = '<p>\t\tContent\t\t</p>';
      const result = await transformHtmlToDocx(html);

      expect(result.length).toBeGreaterThan(0);
    });

    it('should preserve line breaks in textToDocx', async () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const result = await textToDocx(text);

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
