import { XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { processTextElementTag } from "./text.handler";


export async function handleSpan(
  element: IHtmlElement,
  styles: IStyles = {}
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  items.push(...(await processTextElementTag(element, { ...styles, ...elementStyles })));

  return items;
}
