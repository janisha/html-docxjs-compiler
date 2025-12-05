const { transformHtmlToDocx, HttpImageDownloadStrategy, ImageDownloadStrategyManager } = require('../dist/index');
const { Document, Packer } = require('docx');
const fs = require('fs');
const path = require('path');

async function runAdvancedDemo() {
  console.log('Running Advanced Demo...\n');

  // Complex HTML content with tables, nested lists, and advanced formatting
  const html = `
    <h1 style="color: darkblue; text-align: center">Company Annual Report 2024</h1>
    
    <h2>Executive Summary</h2>
    <p>This report presents the <strong>key achievements</strong> and <em>financial highlights</em> 
    for the fiscal year 2024. Our company has shown <span style="color: green">remarkable growth</span> 
    across all divisions.</p>
    
    <h2>Financial Overview</h2>
    <table>
      <thead>
        <tr>
          <th style="background-color: gray;">Quarter</th>
          <th style="background-color: gray;">Revenue</th>
          <th style="background-color: gray;">Profit</th>
          <th style="background-color: gray;">Growth</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Q1 2024</td>
          <td style="text-align: right">$2.5M</td>
          <td style="text-align: right; background-color: lightyellow;">$450K</td>
          <td style="text-align: right; color: green">+12%</td>
        </tr>
        <tr>
          <td>Q2 2024</td>
          <td style="text-align: right">$2.8M</td>
          <td style="text-align: right; background-color: lightyellow;">$520K</td>
          <td style="text-align: right; color: green">+15%</td>
        </tr>
        <tr>
          <td  style="background-color: #f0f0f0">Q3 2024</td>
          <td style="text-align: right; background-color: #f0f0f0;">$3.1M</td>
          <td style="text-align: right; background-color: #f0f0f0;">$580K</td>
          <td style="text-align: right; background-color: #f0f0f0; color: green">+18%</td>
        </tr>
        <tr style="font-weight: bold; background-color: lightgray">
          <td>Total</td>
          <td style="text-align: right">$8.4M</td>
          <td style="text-align: right; background-color: lightyellow;">$1.55M</td>
          <td style="text-align: right">+15%</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Key Achievements</h2>
    <ul>
      <li><strong>Product Launch:</strong> Successfully launched 3 new products</li>
      <li><strong>Market Expansion:</strong> Entered 5 new markets
        <ul>
          <li>North America: <em>successful penetration</em></li>
          <li>Europe: <em>growing presence</em></li>
          <li>Asia-Pacific: <em>establishing foothold</em></li>
        </ul>
      </li>
      <li><strong>Team Growth:</strong> Increased workforce by 25%</li>
      <li><strong>Customer Satisfaction:</strong> Achieved 95% satisfaction rate</li>
    </ul>
    
    <h2>Strategic Priorities for 2025</h2>
    <ol>
      <li>Enhance product portfolio with AI integration</li>
      <li>Expand customer base through digital marketing
        <ol>
          <li>Social media campaigns</li>
          <li>Content marketing</li>
          <li>Partnership programs</li>
        </ol>
      </li>
      <li>Improve operational efficiency by 20%</li>
      <li>Invest in employee development programs</li>
    </ol>
    
    <h2>Technology Stack</h2>
    <p>Our development team utilizes modern technologies including:</p>
    <div>
      <p><strong>Frontend:</strong> React, TypeScript, Next.js</p>
      <p><strong>Backend:</strong> Node.js, Express, PostgreSQL</p>
      <p><strong>DevOps:</strong> Docker, Kubernetes, CI/CD pipelines</p>
    </div>

    <div>
      <p><strong>Image example:</strong></p>
      <img src="https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U" alt="Modern art" />
    </div>
    
    <h2>Important Notes</h2>
    <p style="background-color: lightyellow; color: darkred">
      ⚠️ <strong>Confidential:</strong> This document contains sensitive financial information 
      and should not be distributed outside the organization.
    </p>
    
    <h2>Chemical Formula Example</h2>
    <p>Water molecule: H<sub>2</sub>O</p>
    <p>Einstein's equation: E = mc<sup>2</sup></p>
    
    <h2>Contact Information</h2>
    <p>For more information, visit our website at 
    <a href="https://example.com">https://example.com</a> or contact us at 
    <a href="mailto:info@example.com">info@example.com</a>.</p>
    
    <p style="text-align: center; font-style: italic">
      <s>Draft Version</s> - Final Version - December 2024
    </p>
  `;

  try {
    // Set up image download strategy (optional)
    console.log('Setting up configuration...');
    const strategyManager = new ImageDownloadStrategyManager();
    strategyManager.addStrategy(new HttpImageDownloadStrategy());
    
    const config = {
      strategyManager: strategyManager
    };

    // Transform HTML to DOCX elements
    console.log('Converting HTML to DOCX elements...');
    const docxElements = await transformHtmlToDocx(html, config);
    
    // Create DOCX document with custom properties
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch = 1440 twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: docxElements
      }],
      creator: "HTML-DOCX Compiler Demo",
      title: "Advanced Demo Document",
      description: "Demonstrates advanced features of html-docx-compiler"
    });

    // Generate buffer and save file
    const buffer = await Packer.toBuffer(doc);
    const outputDir = path.join(__dirname, 'output');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'advanced-demo.docx');
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ Success! Document created at:', outputPath);
    console.log('\nThe document includes:');
    console.log('  • Complex tables with styling');
    console.log('  • Nested lists (both ordered and unordered)');
    console.log('  • Various text formatting options');
    console.log('  • Colors and backgrounds');
    console.log('  • Links and special characters');
    console.log('\nYou can now open advanced-demo.docx in Microsoft Word or any DOCX viewer.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

// Run the demo
runAdvancedDemo();
