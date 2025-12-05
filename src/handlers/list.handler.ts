import { Paragraph, TextRun, XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { handleTag } from "./tag.helper";
import { handleText } from "./text.handler";

class PCounter {
  static counter = 1000;
}

export async function handleList(
  element: IHtmlElement,
  level: number = 0,
  styles: IStyles = {}
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);
  
  const listElements = element.children.filter(child => child.name === 'li');
  const instanceNumering = PCounter.counter++;

  for(let i = 0; i < listElements.length; i++) {
    const listElement = listElements[i];
   
    const subStyles: any = { 
      ...styles, 
      ...elementStyles, 
      ...(element.name === 'ul' && { bullet: { level }} ),
      ...(element.name === 'ol' && { numbering: { level, reference: 'numbering', instance: instanceNumering }} )
    };

    if (element.name === 'ul')
      delete subStyles['numbering'];
    else if (element.name === 'ol')
      delete subStyles['bullet'];

    items.push(...(await handleLi(listElement, level, subStyles)));
  }

  return items;
}


export async function handleLi(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  let tempParagraph: Paragraph | null = null;
  const elementStyles = processHtmlElementStyles(element);
  

  for(let i = 0; i < element.children.length; i++) {
    const child = element.children[i];

    if(isTextualElement(child)) {

      const childElements: XmlComponent[] = [];

      if (isTextElement(child)) {
        const textValue = handleText(child);
        if (textValue.trim().length > 0) {
          childElements.push(new TextRun({
            text: textValue,
            ...{...styles, ...elementStyles}
          }));
        }
      } else {
        childElements.push(...(await handleTag(child, level, {...styles, ...elementStyles})));
      }

      if(childElements.length > 0 && !paragraphExists(tempParagraph)) {
        tempParagraph = new Paragraph({
          ...styles,
          children: []
        });
      }

      childElements.forEach(childElement => { tempParagraph!.addChildElement(childElement); } );
    } 
    // Element is not textual. It is some other element like paragraph, table, ul, ol, etc.
    else {
      if(paragraphExists(tempParagraph)) {
        items.push(tempParagraph!);
        tempParagraph = null;
      }

      const sublevel = ['ul', 'ol'].includes(child.name) ? level + 1 : level;
      const itemsToAdd = await handleTag(child, sublevel, {...styles, ...elementStyles});
      items.push(...itemsToAdd);
    }
  }

  if(paragraphExists(tempParagraph)) {
    items.push(tempParagraph!);
  }

  return items;
}


function isTextualElement(element: IHtmlElement): boolean {
  return element.type === 'text' || ['span', 'strong', 'u', 'i', 'em', 'b', 'br'].includes(element.name);
}

function isTextElement(element: IHtmlElement): boolean {
  return element.type === 'text';
}

function paragraphExists(paragraph: Paragraph | null): boolean {
  return paragraph !== null;
}
