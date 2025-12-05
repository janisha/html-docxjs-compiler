import { ExternalHyperlink, XmlComponent } from 'docx';
import { processHtmlElementStyles } from '../helpers/helpers';
import { IHtmlElement, IStyles } from './models';
import { processTextElementTag } from './text.handler';

export async function handleA(
  element: IHtmlElement,
  styles: IStyles = {},
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  const stylesMerged = {
    ...styles,
    ...elementStyles,
    style: 'Hyperlink',
  };

  const tagElements = await processTextElementTag(element, stylesMerged);
  items.push(...tagElements);

  const anchor = new ExternalHyperlink({
    link: element.attribs['href'],
    children: items,
  });

  return [anchor];
}
