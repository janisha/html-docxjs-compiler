import { AlignmentType, Paragraph, TextRun, XmlComponent } from 'docx';
import { getAlignment, parseStyle, processHtmlElementStyles } from '../helpers/helpers';
import { IHtmlElement, IStyles } from './models';
import { handleTag } from './tag.helper';
import { handleText } from './text.handler';

export async function handleP(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
): Promise<XmlComponent[]> {
  const children: XmlComponent[] = [];

  const elementStyles = processHtmlElementStyles(element);
  const paragraphStyles = parseStyle(element.attribs?.style);
  let alignment: typeof AlignmentType[keyof typeof AlignmentType] | null = null;

  if (paragraphStyles['text-align']) {
    alignment = getAlignment(paragraphStyles['text-align']);
  }

  for (let i = 0; i < element.children.length; i++) {
    const child = element.children[i];
    if (child.type === 'text') {
      // parse styles
      children.push(
        new TextRun({
          text: handleText(child),
          ...{ ...styles, ...elementStyles },
        }),
      );
    } else {
      // const sublevel = child.name === 'ol' || child.name === 'ul' ? level + 1 : level;
      const tagElement = await handleTag(child, level, {
        ...styles,
        ...elementStyles,
      });
      children.push(...tagElement);
    }
  }

  const paragraph: any = new Paragraph({
    spacing: {
      before: 200,
      after: 200,
    },
    children: children,
    ...(alignment && { alignment }),
  });

  return [paragraph];
}
