import { UnderlineType, XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { processTextElementTag } from "./text.handler";


export async function handleU(
  element: IHtmlElement,
  styles: IStyles = {}
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  const stylesMerged = { 
    ...styles, 
    ...elementStyles,
    'underline': { type: UnderlineType.SINGLE } 
  };

  items.push(...(await processTextElementTag(element, stylesMerged)));

  return items;
}
