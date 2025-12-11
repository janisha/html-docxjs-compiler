/**
 * Table metadata containing width and column information
 */
export interface TableInfo {
  numberOfColumns: number;
  tableWidth: number;
  hasAnyWidthDefined: boolean;
  columnSizes: number[];
}

/**
 * Element width information
 */
export interface ElementWidthInfo {
  width: number;
  type: 'percentage' | 'pixel' | 'dxa';
  rowspan?: number;
}
