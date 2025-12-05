import { XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { processTextElementTag } from "./text.handler";

export async function handleStriked(
  element: IHtmlElement,
  styles: IStyles = {}
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  const stylesMerged = { 
    ...styles, 
    ...elementStyles,
    'strike': true
  };

  items.push(...(await processTextElementTag(element, stylesMerged)));

  return items;
}
