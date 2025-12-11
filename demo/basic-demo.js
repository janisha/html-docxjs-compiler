const { transformHtmlToDocx } = require('../dist/index');
const { Document, Packer } = require('docx');
const { WORD_NUMBERING_CONFIGURATION } = require('./config');
const fs = require('fs');
const path = require('path');

async function runBasicDemo() {
  console.log('Running Basic Demo...\n');

  // Simple HTML content with various elements
  const html = `
    <h1>Welcome to HTML-DOCX Compiler</h1>
    <p>This is a <strong>basic demo</strong> showing how to convert HTML to DOCX format.</p>
    
    <h2>Features</h2>
    <p>The package supports:</p>
    <ul>
      <li>Headings (H1 through H6)</li>
      <li><strong>Bold</strong> and <em>italic</em> text</li>
      <li><u>Underlined</u> and <s>strikethrough</s> text</li>
      <li>Superscript<sup>2</sup> and subscript<sub>2</sub></li>
      <li>Links like <a href="https://github.com">GitHub</a></li>
    </ul>
    
    <h2>Ordered Lists</h2>
    <p>You can also create numbered lists:</p>
    <ol>
      <li>First item</li>
      <li>Second item</li>
      <li>Third item</li>
    </ol>
    
    <h2>Text Formatting</h2>
    <p style="text-align: center">This text is centered.</p>
    <p style="text-align: right">This text is right-aligned.</p>
    <p style="color: blue">This text is blue.</p>
    <p style="background-color: yellow">This text has a yellow background.</p>
    
    <div>
      <p>You can also use div elements to group content.</p>
      <p>Multiple paragraphs within a div work perfectly.</p>
    </div>
  `;

  try {
    // Transform HTML to DOCX elements
    console.log('Converting HTML to DOCX elements...');
    const docxElements = await transformHtmlToDocx(html);
    
    // Create DOCX document
    const doc = new Document({
      numbering: WORD_NUMBERING_CONFIGURATION,
      sections: [{
        properties: {},
        children: docxElements
      }]
    });

    // Generate buffer and save file
    const buffer = await Packer.toBuffer(doc);
    const outputDir = path.join(__dirname, 'output');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'basic-demo.docx');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ Success! Document created at:', outputPath);
    console.log('\nYou can now open basic-demo.docx in Microsoft Word or any DOCX viewer.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Run the demo
runBasicDemo();
