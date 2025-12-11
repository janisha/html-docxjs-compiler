import { TableCell, TableRow } from 'docx';
import { IHtmlElement, IStyles } from '../models';
import { HtmlToDocxOptions } from '../../services/html-to-word.service';
import { createTableCell } from './table-cell';
import { getChildrenWithTags } from './table-utils';

/**
 * Create a table row with its cells
 * @param element - Table row element (tr)
 * @param level - Nesting level
 * @param styles - Inherited styles
 * @param tableWidth - Table width for calculations
 * @param config - Optional configuration
 * @returns TableRow component
 */
export async function createTableRow(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
  tableWidth: number,
  config?: HtmlToDocxOptions,
): Promise<TableRow> {
  const cellElements = getChildrenWithTags(element, ['td', 'th']);
  const tableCells: TableCell[] = [];

  for (const cellElement of cellElements) {
    const cell = await createTableCell(cellElement, level, styles, tableWidth, config);
    tableCells.push(cell);
  }

  return new TableRow({
    children: tableCells,
  });
}
