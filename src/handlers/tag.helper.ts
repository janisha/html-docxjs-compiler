import { XmlComponent } from 'docx';
import { handleA } from './anchor.handler';
import { handleDiv } from './div.handler';
import { handleH123456 } from './header.handler';
import { handleI } from './italic.handler';
import { handleList } from './list.handler';
import { IHtmlElement, IStyles } from './models';
import { handleP } from './paragraph.handler';
import { handleSpan } from './span.handler';
import { handleStrong } from './strong.handler';
import { handleTable } from './table';
import { handleU } from './underline.handler';
import { handleImage } from './image.handler';
import { handleStriked } from './striked.helper';
import { handleSup } from './sup.helper';
import { handleSub } from './sub.helper';
import { handleBr } from './br.handler';
import { HtmlToDocxOptions } from '../services/html-to-word.service';

export async function handleTag(
  element: IHtmlElement,
  level = 0,
  styles: IStyles = {},
  config?: HtmlToDocxOptions,
): Promise<XmlComponent[]> {
  switch (element.name) {
    case 'div':
      return await handleDiv(element, styles, config);
    case 'p':
      return await handleP(element, level, styles, config);
    case 'a':
      return await handleA(element, styles, config);
    case 'ol':
    case 'ul':
      return await handleList(element, level, styles, config);
    case 'span':
      return await handleSpan(element, styles, config);
    case 'u':
      return await handleU(element, styles, config);
    case 'strong':
    case 'b':
      return await handleStrong(element, styles, config);
    case 's':
      return await handleStriked(element, styles, config);
    case 'sub':
      return await handleSub(element, styles, config);
    case 'sup':
      return await handleSup(element, styles, config);
    case 'i':
    case 'em':
      return await handleI(element, styles, config);
    case 'br':
      return await handleBr();
    case 'table':
      return await handleTable(element, level, styles, config);
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return await handleH123456(element, level, styles, config);
    case 'img':
      return await handleImage(element, styles, config?.strategyManager);
    default:
      return [];
  }
}
