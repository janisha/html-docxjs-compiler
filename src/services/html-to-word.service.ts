import { Paragraph, TextRun, XmlComponent } from 'docx';
import * as cheerio from 'cheerio';
import { handleTag } from '../handlers/tag.helper';
import { handleText } from '../handlers/text.handler';
import { IHtmlElement } from '../handlers/models';
import { BLOCK_ELEMENTS } from '../helpers/constants';

/**
 * Receives html string and returns array of XmlComponent compatible with docx library
 * @param html
 * @returns
 */
export async function transformHtmlToDocx(
  html: string,
): Promise<XmlComponent[]> {
  if (!html) {
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
    if (child.type === 'tag' ) {
      // check if child.name is one of block html elements
      if (BLOCK_ELEMENTS.includes(child.name as any)) {
        const handledElements = await handleTag(child);

        if (handledElements.length > 0) {
          items.push(...handledElements);
        }
      } else if (child.type === 'tag') {
      //   // wrap in paragraph
        const handledElements = ['br'].includes(child.name) ? [] : await handleTag(child);

        if (handledElements.length > 0) {
          const paragraphWithElements = new Paragraph({
            children: handledElements,
          });
          items.push(paragraphWithElements);
        }
      }
    }
    else {
      const paragraphWithElements = new Paragraph({
        children: [
          new TextRun(handleText(child))
        ],
      });
      items.push(paragraphWithElements);
    }
  }

  return items;
}

/**
 * Transforms html to docx that should be used for simple text rendering not some complex structure
 * @param */ 
export async function transformHtmlToDocxSimple(html: string,
  ): Promise<XmlComponent[]> {
    if (!html) {
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
    const handledElements = await handleTag(child);        if (handledElements.length > 0) {
          items.push(...handledElements);
      }
      else {
        const paragraphWithElements = new Paragraph({
          children: [
            new TextRun(handleText(child))
          ],
        });
        items.push(paragraphWithElements);
      }
    }
  
    return items;
  }

/**
 * Parses text and returns array of XmlComponent compatible with docx library
 * @param text
 * @returns
 */
export async function textToDocx(text: string): Promise<XmlComponent[]> {
  if (!text) {
    return [];
  }

  const cleanText = removeNewLinesSpecialCharacters(text, true);
  const textToCompile = `<span>${cleanText}</span>`;
  const docxItems = await transformHtmlToDocxSimple(textToCompile);
 
  return docxItems;
}

/**
 * Remove from text \n \t \r
 */
export function removeNewLinesSpecialCharacters(text: string, keepNewLines = false) {
  let cleanText = text
    .replace(/\n+$/g, '')
    .replace(/\t+$/g, '')
    .replace(/\r+$/g, '');
  
  cleanText = cleanText.replace(/ +$/g, '');

  cleanText = cleanText
    .replace(/\r\n/g, '<br />')
    .replace(/\r/g, '<br />')
    .replace(/\n/g, keepNewLines ? '<br />' : '')
    .replace(/\t/g, '');

  cleanText = cleanText.trim();

  return cleanText;
}

export function removeSpecCharactersForTextValue(text: string) {

}