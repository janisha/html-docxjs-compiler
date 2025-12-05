import { Paragraph, ParagraphChild, TextRun, XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { handleText } from "./text.handler";
import { handleTag } from "./tag.helper";


export async function handleDiv(element: IHtmlElement, style: IStyles): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  
  const elementStyles = processHtmlElementStyles(element);
  const styles = { ...style, ...elementStyles };

  const children = element.children;
  const textElements: ParagraphChild[] = [];

  for (const child of children) {

    if (isTextOnly(child)) {
      const text = await handleText(child);
      textElements.push(new TextRun(text));
    } else {
      if(notBlockElement(child)) {
        const element = await handleTag(child, 0, styles)
        textElements.push(...element);
      } else {
        if (textElements.length > 0) {
          items.push(new Paragraph({
            children: textElements
          }));
          textElements.length = 0;
        }

        const childElements = await handleTag(child, 0, styles);
        items.push(...childElements);
      }
    }
  }

  if (textElements.length > 0) {
    items.push(new Paragraph({
      children: textElements
    }));
  }

  return items;
}

function isTextOnly(element: IHtmlElement) { 
  return element.type === 'text';
}

function notBlockElement(element: IHtmlElement) {
  return ['p','ul','ol','table', 'div'].indexOf(element.name) === -1;
}
 