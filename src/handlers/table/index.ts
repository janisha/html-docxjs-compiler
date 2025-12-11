import {
  Table,
  TableRow,
  WidthType,
  XmlComponent,
} from 'docx';
import { IHtmlElement, IStyles } from '../models';
import { HtmlToDocxOptions } from '../../services/html-to-word.service';
import { TABLE_WIDTH_DXA } from '../../helpers/constants';
import { getTableInfo } from './table-dimensions';
import { createTableRow } from './table-row';
import { getChildrenWithTags } from './table-utils';

/**
 * Extract all table rows from table element (including thead/tbody)
 * @param element - Table element
 * @returns Array of tr elements
 */
function extractTableRows(element: IHtmlElement): IHtmlElement[] {
  const rows: IHtmlElement[] = [];
  const sections = getChildrenWithTags(element, ['thead', 'tbody', 'tr']);

  for (const section of sections) {
    if (section.name === 'thead' || section.name === 'tbody') {
      const sectionRows = getChildrenWithTags(section, ['tr']);
      rows.push(...sectionRows);
    } else {
      rows.push(section);
    }
  }

  return rows;
}

/**
 * Build table width configuration
 * @param tableInfo - Table metadata
 * @returns Table width configuration object
 */
function buildTableWidthConfig(tableInfo: any): any {
  const config: any = {
    width: {
      size: TABLE_WIDTH_DXA,
      type: WidthType.DXA,
    },
  };

  if (!tableInfo.hasAnyWidthDefined) {
    const columnWidth = Math.round(TABLE_WIDTH_DXA / tableInfo.numberOfColumns);
    config.columnWidths = Array(tableInfo.numberOfColumns).fill(columnWidth);
  } else {
    config.columnWidths = tableInfo.columnSizes;
  }

  return config;
}

/**
 * Convert HTML table element to DOCX Table
 * @param element - HTML table element
 * @param level - Nesting level
 * @param styles - Inherited styles
 * @param config - Optional configuration
 * @returns Array containing the Table component
 */
export async function handleTable(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
  config?: HtmlToDocxOptions,
): Promise<XmlComponent[]> {
  const tableInfo = getTableInfo(element);
  const tableWidthConfig = buildTableWidthConfig(tableInfo);

  // Extract all rows from table (including thead/tbody)
  const rowElements = extractTableRows(element);
  const tableRows: TableRow[] = [];

  // Process each row
  for (const rowElement of rowElements) {
    const row = await createTableRow(
      rowElement,
      level,
      styles,
      tableInfo.tableWidth,
      config,
    );
    tableRows.push(row);
  }

  const table = new Table({
    ...tableWidthConfig,
    rows: tableRows,
  });

  return [table];
}
