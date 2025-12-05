# HTML to DOCX Compiler

Convert HTML strings to DOCX format using the [docx](https://www.npmjs.com/package/docx) library.

## Installation

```bash
npm install html-docx-compiler docx
```

## Usage

```typescript
import { transformHtmlToDocx } from 'html-docx-compiler';
import { Document, Packer } from 'docx';
import * as fs from 'fs';

async function createDocument() {
  const html = '<h1>Hello World</h1><p>This is a <strong>paragraph</strong> with <em>formatting</em>.</p>';
  
  const sections = await transformHtmlToDocx(html);
  
  const doc = new Document({
    sections: [{
      children: sections
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('output.docx', buffer);
}

createDocument();
```

## Supported HTML Elements

- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Paragraphs: `p`, `div`
- Text formatting: `strong`, `b`, `em`, `i`, `u`, `s`, `sub`, `sup`
- Lists: `ul`, `ol`, `li`
- Tables: `table`, `tr`, `td`, `th`, `thead`, `tbody`, `tfoot`
- Other: `br`, `a`, `img`, `span`

## Image Support

Images are supported via URLs or base64 data URIs. The package includes optional Firebase Storage integration for downloading images. If you're using Firebase Storage, make sure to install and initialize `firebase-admin` separately.

For non-Firebase URLs, images are downloaded using axios and converted to base64.

**Image constraints:**
- Maximum width: 600px
- Maximum height: 900px
- Images exceeding these dimensions are automatically resized while maintaining aspect ratio

## API

### `transformHtmlToDocx(html: string): Promise<XmlComponent[]>`

Converts an HTML string to an array of DOCX XmlComponents that can be used with the docx library.

**Parameters:**
- `html` (string): The HTML string to convert

**Returns:**
- Promise<XmlComponent[]>: Array of DOCX components

## License

MIT
