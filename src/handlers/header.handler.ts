import { HeadingLevel, Paragraph, XmlComponent } from "docx";
import { processHtmlElementStyles } from "../helpers/helpers";
import { IHtmlElement, IStyles } from "./models";
import { handleText } from "./text.handler";


export async function handleH123456(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {}
): Promise<XmlComponent[]> {
  const elementStyles = processHtmlElementStyles(element);
  const stylesMerged = { ...styles, ...elementStyles };

  let headerText = '';

  element.children.filter(child => child.type === 'text').forEach(child => {
    const textElements = handleText(child);
    headerText += textElements;
  });

  const headings = {
    h1: HeadingLevel.HEADING_1,
    h2: HeadingLevel.HEADING_2,
    h3: HeadingLevel.HEADING_3,
    h4: HeadingLevel.HEADING_4,
    h5: HeadingLevel.HEADING_5,
    h6: HeadingLevel.HEADING_6
  };

  const paragraph: any = new Paragraph({
    text: headerText,
    heading: headings[element.name as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'],
    ...getParagraphStyles(stylesMerged)
  });

  return [paragraph];
}

function getParagraphStyles(styles: IStyles) {
  return {
    spacing: {
      before: styles['margin-top'] ? parseInt(styles['margin-top']) : 0,
      after: styles['margin-bottom'] ? parseInt(styles['margin-bottom']) : 0
    }
  };
}