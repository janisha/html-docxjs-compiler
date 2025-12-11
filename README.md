# HTML to DOCXjs Compiler

[![npm version](https://img.shields.io/npm/v/html-docxjs-compiler.svg)](https://www.npmjs.com/package/html-docxjs-compiler)
[![License: Dual](https://img.shields.io/badge/License-Dual-blue.svg)](LICENSE)

A powerful and flexible TypeScript library that converts HTML strings into DOCXjs XmlComponent format. Built on top of the excellent [docx](https://www.npmjs.com/package/docx) library, this package parses HTML using [cheerio](https://www.npmjs.com/package/cheerio) and transforms it into `XmlComponent` objects that can be seamlessly integrated with the docx API.

## 🚀 Features

- ✅ **Comprehensive HTML Support** - Handles headings, paragraphs, lists, tables, images, and inline formatting
- ✅ **CSS Styling** - Supports inline styles (colors, alignment, text decoration, etc.)
- ✅ **Image Handling** - Base64 data URIs, HTTP/HTTPS URLs, and custom image download strategies
- ✅ **Extensible Architecture** - Strategy pattern for custom image sources (Firebase, S3, Azure, etc.)
- ✅ **Type Safe** - Written in TypeScript with full type definitions
- ✅ **Zero Config** - Works out of the box with sensible defaults
- ✅ **Production Ready** - Battle-tested with proper error handling

## 📦 Installation

```bash
npm install html-docxjs-compiler docx
```

### Peer Dependencies

This package requires `docx` as a peer dependency:

```bash
npm install docx@^8.0.0
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { transformHtmlToDocx } from 'html-docxjs-compiler';
import { Document, Packer } from 'docx';
import * as fs from 'fs';

async function createDocument() {
  const html = `
    <h1>My Document</h1>
    <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
    <ul>
      <li>First item</li>
      <li>Second item</li>
    </ul>
  `;
  
  // Transform HTML to DOCX elements
  const elements = await transformHtmlToDocx(html);
  
  // Create a document with the elements
  const doc = new Document({
    sections: [{
      children: elements
    }]
  });
  
  // Generate and save the document
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('output.docx', buffer);
}

createDocument();
```

## 📖 How It Works

The library uses a three-stage process:

1. **Parse HTML** - Uses [cheerio](https://cheerio.js.org/) to parse HTML into a DOM-like structure
2. **Transform to XmlComponents** - Recursively processes each HTML element and converts it to docx `XmlComponent` objects (Paragraph, TextRun, Table, ImageRun, etc.)
3. **Integration with docx** - Returns array of `XmlComponent[]` that can be used directly in the docx `Document` API

```typescript
HTML String → cheerio Parser → Element Handlers → XmlComponent[] → docx Document
```

### Configuration is Optional

All configuration options are **completely optional**:

- ✅ Works out-of-the-box with no configuration
- ✅ Base64 images work without any setup
- ✅ URL-based images require explicit `strategyManager` configuration
- ✅ Graceful degradation: missing features log warnings, don't throw errors

```typescript
// Simple usage - works immediately
const elements = await transformHtmlToDocx('<p>Hello World</p>');

// With image URL support - requires configuration
import { ImageDownloadStrategyManager, HttpImageDownloadStrategy } from 'html-docxjs-compiler';

const htmlWithImages = await transformHtmlToDocx('<p><img src="imageurl...">></p>');

const strategyManager = new ImageDownloadStrategyManager([
  new HttpImageDownloadStrategy()
]);

const elements = await transformHtmlToDocx(htmlWithImages, { strategyManager });
```

## 🎨 Examples

### Example 1: Document with Formatting

```typescript
import { transformHtmlToDocx } from 'html-docxjs-compiler';
import { Document, Packer } from 'docx';

const html = `
  <h1>Project Report</h1>
  <h2>Executive Summary</h2>
  <p style="text-align: center; color: #333333;">
    This report provides an overview of our <strong>Q4 2024</strong> performance.
  </p>
  
  <h3>Key Highlights</h3>
  <ul>
    <li>Revenue increased by <strong>25%</strong></li>
    <li>Customer satisfaction: <em>95%</em></li>
    <li>New product launch was <u>successful</u></li>
  </ul>
`;

async function generateReport() {
  const elements = await transformHtmlToDocx(html);
  
  const doc = new Document({
    sections: [{
      children: elements
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  // Save or send buffer...
}
```

### Example 2: Tables with Styling

```typescript
const html = `
  <h2>Sales Data</h2>
  <table>
    <thead>
      <tr>
        <th style="background-color: #4472C4; color: white;">Product</th>
        <th style="background-color: #4472C4; color: white;">Q3</th>
        <th style="background-color: #4472C4; color: white;">Q4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Widget A</td>
        <td style="text-align: right;">$50,000</td>
        <td style="text-align: right;">$65,000</td>
      </tr>
      <tr>
        <td>Widget B</td>
        <td style="text-align: right;">$30,000</td>
        <td style="text-align: right;">$42,000</td>
      </tr>
    </tbody>
  </table>
`;

const elements = await transformHtmlToDocx(html);
```

### Example 3: Images with HTTP URLs

```typescript
const html = `
  <h1>Product Catalog</h1>
  <p>Check out our latest products:</p>
  <img src="https://example.com/product-image.jpg" alt="Product" />
  <p>Available in multiple colors.</p>
`;

const elements = await transformHtmlToDocx(html);
```

### Example 4: Base64 Images

```typescript
const html = `
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." />
  <p>Company Logo</p>
`;

const elements = await transformHtmlToDocx(html);
```

## 🔧 Advanced Configuration

### Custom Image Download Strategies

The library uses a **Strategy Pattern** for image downloads, allowing you to customize how images are fetched from different sources.

#### Creating Custom Image Strategy

```typescript
import { ImageDownloadStrategy } from 'html-docxjs-compiler';
import axios from 'axios';

// Custom strategy for S3 signed URLs
class S3ImageDownloadStrategy implements ImageDownloadStrategy {
  canHandle(url: string): boolean {
    return url.includes('s3.amazonaws.com') || url.includes('s3-');
  }

  async download(url: string): Promise<string> {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN' // Add custom headers
      }
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`;
  }
}

// Use your custom strategy
const s3Strategy = new S3ImageDownloadStrategy();
const strategyManager = new ImageDownloadStrategyManager([s3Strategy]);

const elements = await transformHtmlToDocx(html, { strategyManager });
```

#### Multiple Strategies (Chain of Responsibility)

```typescript
import { 
  ImageDownloadStrategyManager,
  HttpImageDownloadStrategy,
} from 'html-docxjs-compiler';

// Strategies are tried in order until one can handle the URL
const strategyManager = new ImageDownloadStrategyManager([
  new FirebaseImageDownloadStrategy('firebase-bucket.appspot.com'),
  new S3ImageDownloadStrategy(),
  new HttpImageDownloadStrategy() // Fallback for any HTTP/HTTPS URL
]);

const elements = await transformHtmlToDocx(html, { strategyManager });
```

## 📋 Supported HTML Elements

### Block Elements

| Element | Description | Styling Support |
|---------|-------------|-----------------|
| `h1` - `h6` | Headings (converted to DOCX heading styles) | ✅ |
| `p` | Paragraphs | ✅ text-align, color, etc. |
| `div` | Division container | ✅ |
| `ul`, `ol` | Unordered/Ordered lists | ✅ Nested lists supported |
| `li` | List items | ✅ |
| `table` | Tables | ✅ |
| `tr` | Table rows | ✅ |
| `td`, `th` | Table cells/headers | ✅ colspan, rowspan, background-color, vertical-align |
| `thead`, `tbody` | Table sections | ✅ |

### Inline Elements

| Element | Description | Styling Support |
|---------|-------------|-----------------|
| `strong`, `b` | Bold text | ✅ |
| `em`, `i` | Italic text | ✅ |
| `u` | Underlined text | ✅ |
| `s` | Strikethrough text | ✅ |
| `sub` | Subscript | ✅ |
| `sup` | Superscript | ✅ |
| `span` | Inline container | ✅ color, background-color, etc. |
| `a` | Hyperlinks | ✅ Creates clickable links |
| `br` | Line break | ✅ |
| `img` | Images | ✅ Auto-resize, multiple sources |

### Supported CSS Styles

- **Colors**: 147+ named colors + hex values (e.g., `#FF0000`, `red`, `darkblue`)
- **Text Alignment**: `left`, `center`, `right`, `justify`
- **Vertical Alignment**: `top`, `middle`, `bottom` (table cells)
- **Background Color**: For table cells and spans
- **Font Styles**: bold, italic, underline, strikethrough

## 🖼️ Image Handling

### Image Constraints

Images are automatically resized to fit within these constraints while maintaining aspect ratio:

- **Maximum Width**: 600px
- **Maximum Height**: 900px

### Supported Image Sources

1. **Base64 Data URIs** - Always supported without configuration (`data:image/png;base64,...`)
2. **HTTP/HTTPS URLs** - Requires `strategyManager` with appropriate strategies
3. **Custom Sources** - Implement `ImageDownloadStrategy` interface

**Note:** If no `strategyManager` is provided:
- Base64 images will work normally
- URL-based images will be skipped with a console warning
- No errors will be thrown

## 📚 API Reference

### Main Functions

#### `transformHtmlToDocx(html: string, options?: HtmlToDocxOptions): Promise<XmlComponent[]>`

Primary function to convert HTML to DOCX elements.

**Parameters:**
- `html` (string): HTML string to convert
- `options` (optional): Configuration options
  - `strategyManager` (ImageDownloadStrategyManager, optional): Custom image download strategy manager
    - If not provided, only base64 images will work
    - URL-based images will be skipped with a warning

**Returns:**
- `Promise<XmlComponent[]>`: Array of docx components ready to use in Document

**Example:**
```typescript
// Without images or with base64 images only
const elements = await transformHtmlToDocx('<p>Hello</p>');

// With URL-based image support
const strategyManager = new ImageDownloadStrategyManager([
  new HttpImageDownloadStrategy()
]);
const elements = await transformHtmlToDocx('<p>Hello</p>', {
  strategyManager
});
```

#### `transformHtmlToDocxSimple(html: string, options?: HtmlToDocxOptions): Promise<XmlComponent[]>`

Simplified transformation for basic text rendering (wraps all content in paragraphs).

**Parameters:**
- Same as `transformHtmlToDocx`

**Returns:**
- `Promise<XmlComponent[]>`

**Use Case:** Simple text content without complex structure

#### `textToDocx(text: string): Promise<XmlComponent[]>`

Converts plain text to DOCX, preserving line breaks as `<br />` tags.

**Parameters:**
- `text` (string): Plain text string

**Returns:**
- `Promise<XmlComponent[]>`

### Strategy Classes

#### `ImageDownloadStrategyManager`

Manages multiple image download strategies using Chain of Responsibility pattern.

**Constructor:**
```typescript
new ImageDownloadStrategyManager(strategies?: ImageDownloadStrategy[])
```

**Methods:**
- `addStrategy(strategy: ImageDownloadStrategy): void` - Add a new strategy
- `download(url: string): Promise<string>` - Download image using first matching strategy

#### `HttpImageDownloadStrategy`

Default strategy for HTTP/HTTPS URLs.

**Methods:**
- `canHandle(url: string): boolean` - Returns true for http:// or https:// URLs
- `download(url: string): Promise<string>` - Downloads and returns base64 data URI

#### `ImageDownloadStrategy` Interface

Implement this interface to create custom image download strategies.

```typescript
interface ImageDownloadStrategy {
  canHandle(url: string): boolean;
  download(url: string): Promise<string>;
}
```

## 🔍 How XmlComponents Work

The `docx` library uses `XmlComponent` objects to build Word documents. This package transforms HTML elements into these components:

```typescript
// HTML
<p>Hello <strong>world</strong>!</p>

// Becomes
new Paragraph({
  children: [
    new TextRun({ text: "Hello " }),
    new TextRun({ text: "world", bold: true }),
    new TextRun({ text: "!" })
  ]
})
```

### Common XmlComponent Types

- `Paragraph` - Block of text (from `<p>`, `<div>`, `<h1>`, etc.)
- `TextRun` - Styled text segment (from `<span>`, `<strong>`, etc.)
- `Table` - Table structure (from `<table>`)
- `TableRow` - Table row (from `<tr>`)
- `TableCell` - Table cell (from `<td>`, `<th>`)
- `ImageRun` - Embedded image (from `<img>`)
- `ExternalHyperlink` - Clickable link (from `<a>`)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is dual-licensed:

- **Personal / Non-Commercial Use**  
  Free under an MIT-style **non-commercial** license.  
  You can use it for personal, educational, and other non-commercial projects.

- **Commercial Use**  
  Commercial use requires a paid license (per legal entity / organization).  
  See [LICENSE](LICENSE) and [LICENSE-COMMERCIAL.md](LICENSE-COMMERCIAL.md) for full terms.

### Commercial Licensing (Overview)

- Standard and Enterprise one-time licenses  
- Per company/organization  
- Perpetual, unlimited use in internal and client projects

After purchase you receive a **license key** and your payment receipt, which together serve as proof of license.

**Is your use commercial?**  
If you're using this in a business, company, SaaS, client work, or any for-profit context, you should obtain a commercial license.  

Questions or edge cases? Email **jankostevanovic@gmail.com**.

## 🙏 Acknowledgments

- [docx](https://www.npmjs.com/package/docx) - Excellent library for generating DOCX files
- [cheerio](https://www.npmjs.com/package/cheerio) - HTML parser
