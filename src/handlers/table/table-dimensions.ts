import { IHtmlElement } from '../models';
import { parseStyle } from '../../helpers/helpers';
import { TABLE_WIDTH_DXA } from '../../helpers/constants';
import { getChildrenWithTags } from './table-utils';
import { TableInfo, ElementWidthInfo } from './types';

/**
 * Get table width from style or width attribute
 * @param table - Table element
 * @returns Table width in pixels, 0 if percentage or not defined
 */
export function getTableWidth(table: IHtmlElement): number {
  if (table.attribs?.style) {
    const styles = parseStyle(table.attribs.style);
    if (styles['width']) {
      if (styles['width'].indexOf('pt') > -1) {
        // Convert points to pixels (1pt = 1.333333px)
        return Math.round(parseInt(styles['width'], 10) * 1.333333);
      } else if (styles['width'].indexOf('%') === -1) {
        return parseInt(styles['width'], 10);
      }
    }
  } else if (table.attribs?.['width']) {
    if (table.attribs['width'].indexOf('%') === -1) {
      return parseInt(table.attribs['width'], 10);
    }
  }

  return 0;
}

/**
 * Get element width information
 * @param element - Table cell element
 * @param tableWidth - Table width in pixels
 * @returns Width information including value, type, and rowspan
 */
export function getElementWidth(
  element: IHtmlElement,
  tableWidth: number,
): ElementWidthInfo {
  const styles = parseStyle(element.attribs?.style);
  const widthAttribute = element.attribs?.['width'];
  const rowspanNum = element.attribs?.['rowspan']
    ? parseInt(element.attribs['rowspan'], 10)
    : 1;
  const rowspan = rowspanNum > 1 ? { rowspan: rowspanNum } : {};

  // Handle style width
  if (styles?.['width']) {
    return calculateWidthFromStyle(styles['width'], tableWidth, rowspan);
  }

  // Handle width attribute
  if (widthAttribute) {
    return calculateWidthFromAttribute(widthAttribute, tableWidth, rowspan);
  }

  return { width: 0, type: 'dxa', ...rowspan };
}

/**
 * Calculate width from style value
 */
function calculateWidthFromStyle(
  styleWidth: string,
  tableWidth: number,
  rowspan: Partial<ElementWidthInfo>,
): ElementWidthInfo {
  // Percentage width
  if (styleWidth.indexOf('%') > -1) {
    const width = TABLE_WIDTH_DXA * (parseInt(styleWidth, 10) / 100);
    return { width, type: 'dxa', ...rowspan };
  }

  // No table width defined, can't calculate relative width
  if (tableWidth === 0) {
    return { width: 0, type: 'dxa', ...rowspan };
  }

  // Points width
  if (styleWidth.indexOf('pt') > -1) {
    const widthInPx = Math.round(parseInt(styleWidth, 10) * 1.333333);
    const widthInPercentage = (widthInPx / tableWidth) * 100;
    const width = TABLE_WIDTH_DXA * (widthInPercentage / 100);
    return { width, type: 'dxa', ...rowspan };
  }

  // Pixel width
  const widthInPx = parseInt(styleWidth, 10);
  const widthInPercentage = (widthInPx / tableWidth) * 100;
  const width = TABLE_WIDTH_DXA * (widthInPercentage / 100);
  return { width, type: 'dxa', ...rowspan };
}

/**
 * Calculate width from attribute value
 */
function calculateWidthFromAttribute(
  widthAttr: string,
  tableWidth: number,
  rowspan: Partial<ElementWidthInfo>,
): ElementWidthInfo {
  // Percentage width
  if (widthAttr.indexOf('%') > -1) {
    const width = TABLE_WIDTH_DXA * (parseInt(widthAttr, 10) / 100);
    return { width, type: 'dxa', ...rowspan };
  }

  // No table width defined
  if (tableWidth === 0) {
    return { width: 0, type: 'dxa', ...rowspan };
  }

  // Pixel width
  const widthInPx = parseInt(widthAttr, 10);
  const widthInPercentage = (widthInPx / tableWidth) * 100;
  const width = TABLE_WIDTH_DXA * (widthInPercentage / 100);
  return { width, type: 'dxa', ...rowspan };
}

/**
 * Count the number of columns in a table row (including colspan)
 * @param row - Table row element
 * @returns Number of columns
 */
export function countColumnsInRow(row: IHtmlElement): number {
  let columnCounter = 0;

  getChildrenWithTags(row, ['td', 'th']).forEach((child: IHtmlElement) => {
    columnCounter++;
    if (child.attribs?.['colspan']) {
      columnCounter += parseInt(child.attribs['colspan'], 10) - 1;
    }
  });

  return columnCounter;
}

/**
 * Get the number of columns in a table
 * @param table - Table element
 * @returns Number of columns
 */
export function getColumnCount(table: IHtmlElement): number {
  const tag = getChildrenWithTags(table, ['thead', 'tbody', 'tr'])[0];
  
  if (!tag) {
    return 0;
  }

  if (tag.name === 'thead' || tag.name === 'tbody') {
    const row = getChildrenWithTags(tag, ['tr'])[0];
    return row ? countColumnsInRow(row) : 0;
  }

  return countColumnsInRow(tag);
}

/**
 * Get comprehensive table information including width and column data
 * @param table - Table element
 * @returns Table metadata
 */
export function getTableInfo(table: IHtmlElement): TableInfo {
  const tableWidth = getTableWidth(table);
  const numberOfColumns = getColumnCount(table);

  return {
    numberOfColumns,
    tableWidth,
    hasAnyWidthDefined: false,
    columnSizes: [],
  };
}
