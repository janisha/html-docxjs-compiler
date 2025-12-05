import {
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextDirection,
  TextRun,
  WidthType,
  XmlComponent,
} from 'docx';
import { getAlignment, getVerticalAlignment, isLineBlockElement, isTagElement, isTextElement, parseStyle } from '../helpers/helpers';
import { IHtmlElement, IStyles } from './models';
import { handleTag } from './tag.helper';
import { handleText } from './text.handler';
import { TableCellMargin, TABLE_WIDTH_DXA } from '../helpers/constants';

/**
 * Returns Table with rows and cells data
 * @param element
 * @param level
 * @param styles
 * @returns
 */
export async function handleTable(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
): Promise<XmlComponent[]> {
  const tableRows: TableRow[] = [];
  const tableWidthInfo = getTableInfos(element);

  const tableWidthConfig: any = {
    width: {
      size: TABLE_WIDTH_DXA,
      type: WidthType.DXA,
    },
  };

  if (!tableWidthInfo.hasAnyWidthDefined) {
    const columnWidth = Math.round(TABLE_WIDTH_DXA / tableWidthInfo.numberOfColumns);
    tableWidthConfig['columnWidths'] = Array(
      tableWidthInfo.numberOfColumns,
    ).fill(columnWidth);
  } else {
    tableWidthConfig['columnWidths'] = tableWidthInfo.columnSizes;
  }

  const filteredTagElements = element.children.filter((child: IHtmlElement) =>
    ['thead', 'tbody', 'tr'].includes(child.name),
  );

  for (let i = 0; i < filteredTagElements.length; i++) {
    const child = filteredTagElements[i];

    if (child.name === 'thead' || child.name === 'tbody') {
      const filteredTrElements = child.children.filter((child: IHtmlElement) =>
        ['tr'].includes(child.name),
      );

      for (let j = 0; j < filteredTrElements.length; j++) {
        const trElement = filteredTrElements[j];
        const tagElement = await handleTableRow(
          trElement,
          level,
          styles,
          tableWidthInfo.tableWidth,
        );
        tableRows.push(tagElement);
      }
    } else {
      const tagElement = await handleTableRow(
        child,
        level,
        styles,
        tableWidthInfo.tableWidth,
      );
      tableRows.push(tagElement);
    }
  }

  const tableData = {
    ...tableWidthConfig,
    rows: tableRows,
  };
  const table = new Table(tableData);

  return [table];
}

/**
 * return TableRow with its Cells content
 * @param element
 * @param level
 * @param styles
 * @param tableWidth
 * @returns
 */
async function handleTableRow(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
  tableWidth: number,
): Promise<TableRow> {
  const tableCells: TableCell[] = [];

  const filteredTagElements = element.children.filter((child: IHtmlElement) =>
    ['td', 'th'].includes(child.name),
  );

  for (let i = 0; i < filteredTagElements.length; i++) {
    const child = filteredTagElements[i];
    const tagElement = await handleTableCell(child, level, styles, tableWidth);
    tableCells.push(tagElement);
  }

  return new TableRow({
    children: tableCells,
  });
}

/**
 * Returns table Cell with its content
 * @param element
 * @param level
 * @param styles
 * @param tableWidth
 * @returns
 */
async function handleTableCell(
  element: IHtmlElement,
  level: number,
  styles: IStyles = {},
  tableWidth: number,
): Promise<TableCell> {
  // return one table cell that contains Paragraph with all the children
  const children: any[] = [];
  const cellStyles = element.attribs?.style
    ? parseStyle(element.attribs?.style)
    : {};

  const stylesToPass = {
    ...styles,
    ...(cellStyles['text-align'] && {
      alignment: getAlignment(cellStyles['text-align']),
    }),
  };

  if (element.children.length > 1) {
    const filteredChildren = element.children.filter(
      (child) =>
      isTagElement(child) || (isTextElement(child) && child.data.trim()),
    );

    for (let i = 0; i < filteredChildren.length; i++) {
      const child = filteredChildren[i];
      if (isTextElement(child) || isLineBlockElement(child)) {
        const children = isTextElement(child) 
          ? [new TextRun({ text: handleText(child) })]
          : await handleTag(child, level, stylesToPass);

        children.push(
          new Paragraph({
            children: children,
            ...stylesToPass,
          }),
        );
      } else {
        const tagElements = await handleTag(child, level, stylesToPass);
        children.push(...tagElements);
      }
    }
  } else {
    if (element.children[0].type === 'text') {
      children.push(
        new Paragraph({
          text: handleText(element.children[0]),
          ...stylesToPass,
        }),
      );
    } else {
      if (['p', 'table'].includes(element.children[0].name.toLowerCase())) {
        const tagElements = await handleTag(
          element.children[0],
          level,
          stylesToPass,
        );
        children.push(...tagElements);
      } else {
        const tagElements = await handleTag(
          element.children[0],
          level,
          stylesToPass,
        );
        children.push(
          new Paragraph({
            children: tagElements,
          }),
        );
      }
    }
  }

  // ako je tableWidth 0 onda kalulisati samo procente
  // ako je tableWidth > 0 onda kalulisati koliko je procentualno od tableWidth

  let cellData: any = { children };

  // if(cellStyles['width']) {
  //   const isPercentage = cellStyles['width'].indexOf('%') > -1;

  //   let width = 0;
  //   if(isPercentage) {
  //     width = Math.round(9200 * (parseInt(cellStyles['width']) / 100));
  //   } else {
  //     const cellWidthInPixels = parseInt(cellStyles['width']);
  //     if (tableWidth > 0) {
  //       width = Math.round(9200 * (cellWidthInPixels / tableWidth));
  //     }
  //   }

  //   cellData = {
  //     ...cellData,
  //     ...(width > 0 && { width: {
  //                                 size: width,
  //                                 type: WidthType.DXA
  //                               }
  //                       }
  //     ),
  //   };
  // }

  // check colspan and rowspan attributes
  if (element.attribs['colspan'] && parseInt(element.attribs['colspan']) > 1) {
    cellData = {
      ...cellData,
      columnSpan: parseInt(element.attribs['colspan']),
    };
  }

  if (element.attribs['rowspan'] && parseInt(element.attribs['rowspan']) > 1) {
    cellData = {
      ...cellData,
      rowSpan: parseInt(element.attribs['rowspan']),
    };
  }

  // check vertical Alignment
  if (cellStyles['vertical-align']) {
    cellData = {
      ...cellData,
      verticalAlign: getVerticalAlignment(cellStyles['vertical-align']),
      // TextDirection: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT
    };
  }

  if (cellStyles['background-color']) {
    cellData = {
      ...cellData,
      shading: {
        fill: cellStyles['background-color'],
        val: ShadingType.CLEAR,
        color: 'auto',
      },
    };
  }

  cellData = {
    ...cellData,
    margins: TableCellMargin,
  };

  // no borders 
  // // Testiranje bordera da bude none
  // cellData = {
  //   ...cellData,
  //   borders: {
  //     top: {
  //       sryle: 'none',
  //       size: 0,
  //       color: 'FFFFFF',
  //     },
  //     bottom: {
  //       sryle: 'none',
  //       size: 0,
  //       color: 'FFFFFF',
  //     },
  //     left: {
  //       sryle: 'none',
  //       size: 0,
  //       color: 'FFFFFF',
  //     },
  //     right: {
  //       sryle: 'none',
  //       size: 0,
  //       color: 'FFFFFF',
  //     },
  //   }
  // };

  return new TableCell(cellData);
}

// function that goes through all table cells and returns a list of widths for each column
// we can count number of cells and return first row where cells have width defined
// if there is no width defined for any cell, we can return an array numbers that are 9200 / number of cells
function getTableInfos(table: IHtmlElement): {
  numberOfColumns: number;
  tableWidth: number;
  hasAnyWidthDefined: boolean;
  columnSizes: number[];
} {
  const sumOfColumnWidths = 0;
  const hasAnyWidthDefined = false;
  const columnSizes: number[] = [];

  const tableWidth = getTableWidth(table);
  const tableWidthDefined: boolean = tableWidth > 0;
  const numberOfColumns = getColumnCount(table);

  const allColumnsWidths: any[][] = [];

  // go through all rows and get all widths
  // if cell dont have width defined, set it to 0
  // if column is spanned, set the rest of spans to 0
  table.children
    .filter((child: IHtmlElement) =>
      ['thead', 'tbody', 'tr'].includes(child.name),
    )
    .forEach((child: IHtmlElement) => {
      if (child.name === 'thead' || child.name === 'tbody') {
        child.children
          .filter((child: IHtmlElement) => ['tr'].includes(child.name))
          .forEach((child: IHtmlElement) => {
            const cellWidths: any = [];
            child.children
              .filter((child: IHtmlElement) =>
                ['td', 'th'].includes(child.name),
              )
              .forEach((cell: IHtmlElement) => {
                const cellWidthInfo = getElementWidth(cell, tableWidth);
                cellWidths.push(cellWidthInfo);
              });
            allColumnsWidths.push(cellWidths);
          });
      } else {
        const cellWidths: any = [];
        child.children
          .filter((child: IHtmlElement) => ['td', 'th'].includes(child.name))
          .forEach((cell: IHtmlElement) => {
            const cellWidthInfo = getElementWidth(cell, tableWidth);
            cellWidths.push(cellWidthInfo);
          });
        allColumnsWidths.push(cellWidths);
      }
    });

  // allColumnsWidths.forEach((row: any[]) => console.table(row));

  // // Calculate total width of the table and maximum number of columns
  // table.children.filter((child: IHtmlElement) =>
  //   ['thead', 'tbody', 'tr'].includes(child.name)
  // ).forEach((child: IHtmlElement) => {
  //   if (child.name === 'thead' || child.name === 'tbody') {
  //     child.children.filter((child: IHtmlElement) =>
  //       ['tr'].includes(child.name))
  //       .forEach((child: IHtmlElement) => {
  //         let columnCounter = 0;
  //         let rowWidth = 0;
  //         let rowColumnSizes: number[] = [];
  //         // go through all cells in this row
  //         child.children.filter((child: IHtmlElement) =>
  //           ['td', 'th'].includes(child.name)
  //         ).forEach((child: IHtmlElement) => {
  //           columnCounter++;
  //           const cellStyles = parseStyle(child.attribs.style);
  //           if(cellStyles['width']) {
  //             hasAnyWidthDefined = true;
  //             const isPercentage = cellStyles['width'].indexOf('%') > -1;

  //             if(!isPercentage) {
  //               const cellWidth = parseInt(cellStyles['width'], 10);
  //               rowWidth += cellWidth;
  //               rowColumnSizes.push(cellWidth);
  //             }
  //           }
  //         });
  //         sumOfColumnWidths = sumOfColumnWidths < rowWidth ? rowWidth : sumOfColumnWidths;
  //         numberOfColumns = numberOfColumns < columnCounter ? columnCounter : numberOfColumns;
  //       });
  //   } else {
  //     let columnCounter = 0;
  //     let rowWidth = 0;
  //     // go through all cells in this row
  //     child.children.filter((child: IHtmlElement) =>
  //       ['td', 'th'].includes(child.name)
  //     ).forEach((child: IHtmlElement) => {
  //       columnCounter++;
  //       const cellStyles = parseStyle(child.attribs.style);
  //           if(cellStyles['width']) {
  //             hasAnyWidthDefined = true;
  //             const isPercentage = cellStyles['width'].indexOf('%') > -1;

  //             if(!isPercentage) {
  //               const cellWidth = parseInt(cellStyles['width'], 10);
  //               rowWidth += cellWidth;
  //             }
  //           }
  //     });
  //     sumOfColumnWidths = sumOfColumnWidths < rowWidth ? rowWidth : sumOfColumnWidths;
  //     numberOfColumns = numberOfColumns < columnCounter ? columnCounter : numberOfColumns;
  //   }
  // });

  // const tableStyles = parseStyle(table.attribs.style);
  // if(tableStyles['width']) {
  //   const isPercentage = tableStyles['width'].indexOf('%') > -1;

  //   if(!isPercentage) {
  //     const tableWidth = parseInt(tableStyles['width'], 10);
  //     sumOfColumnWidths = tableWidth;
  //   }
  // }

  // /*
  //   calculate cell widths
  //   */
  // table.children.filter((child: IHtmlElement) =>
  //   ['thead', 'tbody', 'tr'].includes(child.name)
  // ).forEach((child: IHtmlElement) => {
  //   if (child.name === 'thead' || child.name === 'tbody') {
  //     child.children.filter((child: IHtmlElement) =>
  //       ['tr'].includes(child.name))
  //       .forEach((child: IHtmlElement) => {
  //         let rowColumnSizes: number[] = [];
  //         // go through all cells in this row
  //         child.children.filter((child: IHtmlElement) =>
  //           ['td', 'th'].includes(child.name)
  //         ).forEach((child: IHtmlElement) => {
  //           const cellStyles = parseStyle(child.attribs.style);
  //           if(cellStyles['width']) {
  //             hasAnyWidthDefined = true;
  //             const isPercentage = cellStyles['width'].indexOf('%') > -1;

  //             if(!isPercentage) {
  //               const cellWidth = parseInt(cellStyles['width'], 10);
  //               if(cellWidth > 0){
  //                 const size = 9200 * (parseInt(cellStyles['width'], 10) / sumOfColumnWidths);
  //                 rowColumnSizes.push(Math.round(size));
  //               }
  //             } else {
  //               const size = 9200 * (parseInt(cellStyles['width'], 10) / 100);
  //               if(size > 0)
  //                 rowColumnSizes.push(size);
  //             }
  //           }
  //         });
  //         if(columnSizes.length < rowColumnSizes.length) {
  //           columnSizes = rowColumnSizes;
  //         }
  //       });
  //   } else {
  //     let rowColumnSizes: number[] = [];
  //     // go through all cells in this row
  //     child.children.filter((child: IHtmlElement) =>
  //       ['td', 'th'].includes(child.name)
  //     ).forEach((child: IHtmlElement) => {
  //       const cellStyles = parseStyle(child.attribs.style);
  //           if(cellStyles['width']) {
  //             hasAnyWidthDefined = true;
  //             const isPercentage = cellStyles['width'].indexOf('%') > -1;

  //             if(!isPercentage) {
  //               const cellWidth = parseInt(cellStyles['width'], 10);
  //               if(cellWidth > 0){
  //                 const size = 9200 * (parseInt(cellStyles['width'], 10) / sumOfColumnWidths);
  //                 rowColumnSizes.push(Math.round(size));
  //               }
  //             } else {
  //               const size = 9200 * (parseInt(cellStyles['width'], 10) / 100);
  //               if(size > 0)
  //                 rowColumnSizes.push(Math.round(size));
  //             }
  //           }
  //     });
  //     if(columnSizes.length < rowColumnSizes.length) {
  //       columnSizes = rowColumnSizes;
  //     }
  //   }
  // });

  return {
    numberOfColumns,
    tableWidth: sumOfColumnWidths, // > 0 ? sumOfColumnWidths : 9200,
    hasAnyWidthDefined,
    columnSizes,
  };
}

/**
 * Returns the number of columns in a table
 * @param table
 * @returns number of columns in table
 */
function getColumnCount(table: IHtmlElement): number {
  let columnCounter = 0;

  // get the first row of the table (could be in thead or tbody)
  // if there is no thead or tbody, the first row is the first tr
  // if there is no thead or tbody and no tr, there are no columns
  const tag = getChildrenWithTags(table, ['thead', 'tbody', 'tr'])[0];
  if (tag.name === 'thead' || tag.name === 'tbody') {
    const row = getChildrenWithTags(tag, ['tr'])[0];
    columnCounter = countColumnsInRow(row);
  } else {
    columnCounter = countColumnsInRow(tag);
  }

  return columnCounter;
}

/**
 * Count the number of columns in a row
 * @param row
 * @returns
 */
function countColumnsInRow(row: IHtmlElement): number {
  let columnCounter = 0;

  // go through all cells in this row
  // if there is a colspan, add that to the column counter
  // if there is no colspan, add 1 to the column counter
  getChildrenWithTags(row, ['td', 'th']).forEach((child: IHtmlElement) => {
    columnCounter++;
    if (child.attribs['colspan']) {
      columnCounter += parseInt(child.attribs['colspan']) - 1;
    }
  });

  return columnCounter;
}

function getTableWidth(table: IHtmlElement): number {
  if (table.attribs.style) {
    const styles = parseStyle(table.attribs.style);
    if (styles['width']) {
      if (styles['width'].indexOf('pt') > -1) {
        return Math.round(parseInt(styles['width'], 10) * 1.333333);
      } else {
        return parseInt(styles['width'], 10);
      }
    }
  } else if (table.attribs['width']) {
    if (table.attribs['width'].indexOf('%') > -1) {
      return 0;
    } else {
      return parseInt(table.attribs['width'], 10);
    }
  }

  return 0;
}

function getElementWidth(
  element: IHtmlElement,
  tableWidth: number,
): { width: number; type: 'percentage' | 'pixel' | 'dxa'; rowspan?: number } {
  const styles = parseStyle(element.attribs?.style);
  const widthAttribute = element.attribs['width'];
  const rowspanNum = element.attribs['rowspan']
    ? parseInt(element.attribs['rowspan'], 10)
    : 1;
  const rowspan = {
    ...(rowspanNum > 1 ? { rowsnap: rowspanNum } : {}),
  };

  if (styles && styles['width']) {
    if (styles['width'].indexOf('%') > -1) {
      const width = TABLE_WIDTH_DXA * (parseInt(styles['width'], 10) / 100);
      return { width, type: 'dxa', ...rowspan };
    }

    if (tableWidth === 0) {
      return { width: 0, type: 'dxa', ...rowspan };
    }

    if (styles['width'].indexOf('pt') > -1) {
      const widthInPx = Math.round(parseInt(styles['width'], 10) * 1.333333);
      const widthInPercentage = (widthInPx / tableWidth) * 100;
      const width = TABLE_WIDTH_DXA * (widthInPercentage / 100);
      return { width, type: 'dxa', ...rowspan };
    }

    const widthInPx = parseInt(styles['width'], 10);
    const widthInPercentage = (widthInPx / tableWidth) * 100;
    const width = TABLE_WIDTH_DXA * (widthInPercentage / 100);
    return { width, type: 'dxa', ...rowspan };
  }

  if (widthAttribute) {
    if (widthAttribute.indexOf('%') > -1) {
      const width = TABLE_WIDTH_DXA * (parseInt(styles['width'], 10) / 100);
      return { width, type: 'dxa', ...rowspan };
    }

    if (tableWidth === 0) {
      return { width: 0, type: 'dxa', ...rowspan };
    }

    const widthInPx = parseInt(styles['width'], 10);
    const widthInPercentage = (widthInPx / tableWidth) * 100;
    const width = TABLE_WIDTH_DXA * (widthInPercentage / 100);
    return { width, type: 'dxa', ...rowspan };
  }

  return { width: 0, type: 'dxa', ...rowspan };
}

/**
 * Filter children by tag name
 * @param html
 * @param tags
 * @returns list of children with given tags
 */
function getChildrenWithTags(
  html: IHtmlElement,
  tags: string[],
): IHtmlElement[] {
  return html.children.filter((child: IHtmlElement) =>
    tags.includes(child.name),
  );
}
