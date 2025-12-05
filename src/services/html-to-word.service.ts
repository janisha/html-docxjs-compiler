import { Paragraph, TextRun, XmlComponent } from 'docx';
import * as cheerio from 'cheerio';
import { handleTag } from '../handlers/tag.helper';
import { handleText } from '../handlers/text.handler';
import { IHtmlElement } from '../handlers/models';
import { BLOCK_ELEMENTS } from '../helpers/constants';
import { ImageDownloadStrategyManager } from '../strategies';

export interface HtmlToDocxOptions {
  /** Custom image download strategy manager */
  strategyManager?: ImageDownloadStrategyManager;
}

/**
 * Receives html string and returns array of XmlComponent compatible with docx library
 * @param html - HTML string to transform
 * @param options - Optional configuration for transformation
 * @returns Array of XmlComponents
 */
export async function transformHtmlToDocx(
  html: string,
  options?: HtmlToDocxOptions,
): Promise<XmlComponent[]> {
  if (!html || typeof html !== 'string') {
    return [];
  }

  html = removeNewLinesSpecialCharacters(html);

  if (!html.startsWith('<')) {
    html = `<div>${html}</div>`;
  }

  const $ = cheerio.load(html);
  const items: XmlComponent[] = [];

  const children = $('body').children();

  for (let i = 0; i < children.length; i++) {
    const child: IHtmlElement = children[i] as any;
    
    if (child.type === 'tag') {
      // Check if child.name is one of block html elements
      if (BLOCK_ELEMENTS.includes(child.name as any)) {
        const handledElements = await handleTag(child, 0, {}, options);
        if (handledElements.length > 0) {
          items.push(...handledElements);
        }
      } else {
        // Wrap inline elements in paragraph (skip br tags)
        const handledElements = child.name === 'br' ? [] : await handleTag(child, 0, {}, options);
        if (handledElements.length > 0) {
          items.push(new Paragraph({ children: handledElements }));
        }
      }
    } else if (child.type === 'text') {
      // Handle text nodes
      const textContent = handleText(child);
      if (textContent.trim()) {
        items.push(new Paragraph({ children: [new TextRun(textContent)] }));
      }
    }
  }

  return items;
}

/**
 * Transforms html to docx that should be used for simple text rendering not some complex structure
 * @param html - HTML string to transform
 * @param options - Optional configuration for transformation
 * @returns Array of XmlComponents
 */
export async function transformHtmlToDocxSimple(
  html: string,
  options?: HtmlToDocxOptions,
): Promise<XmlComponent[]> {
  if (!html || typeof html !== 'string') {
    return [];
  }

  html = removeNewLinesSpecialCharacters(html);

  if (!html.startsWith('<')) {
    html = `<div>${html}</div>`;
  }

  const $ = cheerio.load(html);
  const items: XmlComponent[] = [];
  const children = $('body').children();

  for (let i = 0; i < children.length; i++) {
    const child: IHtmlElement = children[i] as any;
    const handledElements = await handleTag(child, 0, {}, options);
    
    if (handledElements.length > 0) {
      items.push(...handledElements);
    } else if (child.type === 'text') {
      const textContent = handleText(child);
      if (textContent.trim()) {
        items.push(new Paragraph({ children: [new TextRun(textContent)] }));
      }
    }
  }

  return items;
}

/**
 * Parses text and returns array of XmlComponent compatible with docx library
 * @param text - Plain text to convert to DOCX
 * @returns Array of XmlComponents
 */
export async function textToDocx(text: string): Promise<XmlComponent[]> {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const cleanText = removeNewLinesSpecialCharacters(text, true);
  const textToCompile = `<span>${cleanText}</span>`;
  const docxItems = await transformHtmlToDocxSimple(textToCompile);

  return docxItems;
}

/**
 * Remove special characters (newlines, tabs, carriage returns) from text
 * Converts line breaks to HTML <br /> tags
 * @param text - Text to clean
 * @param keepNewLines - Whether to preserve newlines as <br /> tags (default: false)
 * @returns Cleaned text
 */
export function removeNewLinesSpecialCharacters(
  text: string,
  keepNewLines = false,
): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove trailing special characters
  let cleanText = text
    .replace(/\n+$/g, '')
    .replace(/\t+$/g, '')
    .replace(/\r+$/g, '')
    .replace(/ +$/g, '');

  // Convert line breaks to HTML br tags
  cleanText = cleanText
    .replace(/\r\n/g, '<br />')
    .replace(/\r/g, '<br />')
    .replace(/\n/g, keepNewLines ? '<br />' : '')
    .replace(/\t/g, '');

  return cleanText.trim();
}