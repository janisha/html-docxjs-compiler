import { XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { processTextElementTag } from "./text.handler";
import { HtmlToDocxOptions } from "../services/html-to-word.service";

export async function handleSub(
  element: IHtmlElement,
  styles: IStyles = {},
  config?: HtmlToDocxOptions
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  const stylesMerged = { 
    ...styles, 
    ...elementStyles,
    'subScript': true
  };

  items.push(...(await processTextElementTag(element, stylesMerged, config)));

  return items;
}
