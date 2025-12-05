import { UnderlineType, XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { processTextElementTag } from "./text.handler";
import { HtmlToDocxOptions } from "../services/html-to-word.service";


export async function handleU(
  element: IHtmlElement,
  styles: IStyles = {},
  config?: HtmlToDocxOptions
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  const stylesMerged = { 
    ...styles, 
    ...elementStyles,
    'underline': { type: UnderlineType.SINGLE } 
  };

  items.push(...(await processTextElementTag(element, stylesMerged, config)));

  return items;
}
