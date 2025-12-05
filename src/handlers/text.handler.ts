import { IRunOptions, TextRun, XmlComponent } from "docx";
import { IHtmlElement, IStyles } from "./models";
import { handleTag } from "./tag.helper";

export async function processTextElementTag(element: IHtmlElement, style: IStyles = {}): Promise<XmlComponent[]> {
  const items: any[] = [];

  try {
    for(let i = 0; i < element.children.length; i++) {
      const child: IHtmlElement = element.children[i] as any;
      if(child.type === 'text') {
        const textRunStyles = getStylesForTextRun(style);
        items.push(new TextRun({
          text: handleText(child),
          ...textRunStyles
        }));
      } else {
        items.push(...(await handleTag(child, 0, style)));
      }
    }
  } catch (error) {
    // Silently handle errors and return empty array
  }
  return items;
}

export function handleText(element: IHtmlElement): string {
  try {
    // remove all line breaks if occure once or more
    const filteredText = element.data.replace(/(\r\n|\n|\n\t|\r|\t)/gm, '');
    return filteredText;
  } catch (error) {
    return ' ';
  }
}

function getStylesForTextRun(styles: IStyles): Partial<IRunOptions> {
  const { 
    bold,
    italics,
    underline,
    size,
    color,
    font,
    subScript,
    superScript,
    strike,
    highlight,
    shading
  } = styles;

  return {
    ...(bold && { bold }),
    ...(italics && { italics }),
    ...(underline && { underline }),
    ...(size && { size }),
    ...(color && { color }),
    ...(font && { font }),
    ...(subScript && { subScript }),
    ...(superScript && { superScript }),
    ...(strike && { strike }),
    ...(highlight && highlight.indexOf('#') === -1 && { highlight }),
    ...(shading && { shading }),
  }
}
