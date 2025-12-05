
/**
 * Model that represents a single HTML element from the HTML parser Cherio
 * There are more data available, but we are only interested in these
 */
export interface IHtmlElement {
  type: 'tag' | 'text';
  name: string;
  // data available only for text
  data: string;
  children: IHtmlElement[];
  attribs: Partial<{
    class: string;
    style: string;
    [key: string]: any;
  }>
};


/**
 * Represents a style object parsed from a style string
 * e.g. 'font-weight: bold; font-style: italic;'
 * will be parsed to { 'font-weight': 'bold', 'font-style': 'italic' }
 */
export interface IStyles {
  [key: string]: any;
};