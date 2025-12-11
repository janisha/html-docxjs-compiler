import {
  Paragraph,
  ShadingType,
  TableCell,
  TextRun,
  XmlComponent,
} from 'docx';
import { getAlignment, getVerticalAlignment, isLineBlockElement, isTagElement, isTextElement, parseStyle } from '../../helpers/helpers';
import { HtmlToDocxOptions } from '../../services/html-to-word.service';
import { IHtmlElement, IStyles } from '../models';
import { handleTag } from '../tag.helper';
import { handleText } from '../text.handler';
import { TableCellMargin } from '../../helpers/constants';
import { hasAttributeWithMinValue } from './table-utils';

/**
 * Process cell children and convert to paragraphs
 * @param element - Table cell element
 * @param level - Nesting level
 * @param stylesToPass - Styles to apply
 * @param config - Optional configuration
 * @returns Array of XmlComponents (paragraphs)
 */
async function processCellChildren(
  element: IHtmlElement,
  level: number,
  stylesToPass: IStyles,
  config?: HtmlToDocxOptions,
): Promise<XmlComponent[]> {
  const cellContent: XmlComponent[] = [];

  if (element.children.length === 0) {
    return [new Paragraph({ children: [] })];
  }

  if (element.children.length === 1) {
    return processSingleChild(element.children[0], level, stylesToPass, config);
  }

  return processMultipleChildren(element.children, level, stylesToPass, config);
}

/**
 * Process a single child element
 */
async function processSingleChild(
  child: IHtmlElement,
  level: number,
  stylesToPass: IStyles,
  config?: HtmlToDocxOptions,
): Promise<XmlComponent[]> {
  if (child.type === 'text') {
    return [
      new Paragraph({
        text: handleText(child),
        ...stylesToPass,
      }),
    ];
  }

  const tagElements = await handleTag(child, level, stylesToPass, config);

  // Block elements (p, table) should not be wrapped
  if (['p', 'table'].includes(child.name?.toLowerCase())) {
    return tagElements;
  }

  // Inline elements should be wrapped in a paragraph
  return [new Paragraph({ children: tagElements })];
}

/**
 * Process multiple child elements
 */
async function processMultipleChildren(
  children: IHtmlElement[],
  level: number,
  stylesToPass: IStyles,
  config?: HtmlToDocxOptions,
): Promise<XmlComponent[]> {
  const cellContent: XmlComponent[] = [];

  const filteredChildren = children.filter(
    (child) =>
      isTagElement(child) || (isTextElement(child) && child.data?.trim()),
  );

  for (const child of filteredChildren) {
    if (isTextElement(child) || isLineBlockElement(child)) {
      const paragraphChildren = isTextElement(child)
        ? [new TextRun({ text: handleText(child) })]
        : await handleTag(child, level, stylesToPass, config);

      cellContent.push(
        new Paragraph({
          children: paragraphChildren,
          ...stylesToPass,
        }),
      );
    } else {
      const tagElements = await handleTag(child, level, stylesToPass, config);
      cellContent.push(...tagElements);
    }
  }

  return cellContent;
}

/**
 * Build cell configuration object
 */
function buildCellConfig(
  element: IHtmlElement,
  cellStyles: Record<string, string>,
  children: XmlComponent[],
): any {
  let cellData: any = { children };

  // Handle colspan
  if (hasAttributeWithMinValue(element, 'colspan', 1)) {
    cellData.columnSpan = parseInt(element.attribs['colspan'], 10);
  }

  // Handle rowspan
  if (hasAttributeWithMinValue(element, 'rowspan', 1)) {
    cellData.rowSpan = parseInt(element.attribs['rowspan'], 10);
  }

  // Handle vertical alignment
  if (cellStyles['vertical-align']) {
    cellData.verticalAlign = getVerticalAlignment(cellStyles['vertical-align']);
  }

  // Handle background color
  if (cellStyles['background-color']) {
    cellData.shading = {
      fill: cellStyles['background-color'],
      val: ShadingType.CLEAR,
      color: 'auto',
    };
  }

  // Add default margins
  cellData.margins = TableCellMargin;

  return cellData;
}

/**
 * Create a table cell with its content
 * @param element - Table cell element (td or th)
 * @param level - Nesting level
 * @param styles - Inherited styles
 * @param tableWidth - Table width for calculations
 * @param config - Optional configuration
 * @returns TableCell component
 */
export async function createTableCell(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
  tableWidth: number,
  config?: HtmlToDocxOptions,
): Promise<TableCell> {
  const cellStyles = element.attribs?.style
    ? parseStyle(element.attribs.style)
    : {};

  const stylesToPass: IStyles = {
    ...styles,
    ...(cellStyles['text-align'] && {
      alignment: getAlignment(cellStyles['text-align']),
    }),
  };

  const children = await processCellChildren(element, level, stylesToPass, config);
  const cellData = buildCellConfig(element, cellStyles, children);

  return new TableCell(cellData);
}
