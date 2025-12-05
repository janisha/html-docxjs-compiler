/**
 * Default table cell margins for table cells
 */
export const TableCellMargin = {
  top: 100,
  bottom: 100,
  left: 100,
  right: 100,
};

/**
 * Image dimension constraints
 */
export const IMAGE_CONSTRAINTS = {
  MAX_WIDTH: 600,
  MAX_HEIGHT: 900,
} as const;

/**
 * Table width in DXA units (1/20th of a point)
 * 9200 DXA ≈ 6.39 inches (standard page width minus margins)
 */
export const TABLE_WIDTH_DXA = 9200;

/**
 * Block-level HTML elements that should not be wrapped in paragraphs
 */
export const BLOCK_ELEMENTS = [
  'div',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'table',
  'tfoot',
  'blockquote',
] as const;
