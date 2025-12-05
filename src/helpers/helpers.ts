import { AlignmentType, UnderlineType, VerticalAlign } from "docx";
import { IHtmlElement, IStyles } from "../handlers/models";
import { CSS_COLOR_MAP } from "./constants";

/**
 * Returns the parsed style string as an object of key-value pairs
 * e.g. 'font-weight: bold; font-style: italic;'
 * will be parsed to { 'font-weight': 'bold', 'font-style': 'italic' }
 * @param style 
 * @returns 
 */
export function parseStyle(style: string | null | undefined): { [key: string]: string } {
  if (!style) {
    return {};
  }
  
  style = style.trim();
  const styles = style.split(';');
  let result: {
    [key: string]: string
  } = {};

  styles.forEach(style => {
    const [key, value] = style.split(':');
    if(key && value)
      result[key.trim()] = value.trim();
  });

  // filter items that dont have for a key "font-family or font-size"
  Object.keys(result).filter(property => {
    if( ['font-family'].includes(property)) {
      delete result[property];
     }
  });

  if(result['background-color'] && result['background-color'].indexOf('#') === -1) {
    result['background-color'] = transformCssColorNamesIntoHexValues(result['background-color']);
  }

  return result;
}



/**
 * Processes the style string of an HTML element and returns the styles as an object
 * that are supported by the docx library
 * @param element 
 * @returns 
 */
export function processHtmlElementStyles(element: IHtmlElement): IStyles {
  const styleString = element.attribs?.style;
  
  if (!styleString) {
    return {};
  }

  return processStyles(styleString);
}

export function processStyles(styleString: string): IStyles {
  const styles = parseStyle(styleString);
  const result: IStyles = {};
  
  if(styles['font-weight'] === 'bold') {
    result['bold'] = true;
  }

  if(styles['font-weight'] === 'normal') {
    result['bold'] = false;
  }
  
  if(styles['font-style'] === 'italic') {
    result['italics'] = true;
  }

  if(styles['text-decoration'] === 'underline') {
    result['underline'] = { type: UnderlineType.SINGLE };
  }

  if(styles['text-decoration'] === 'line-through') {
    result['strike'] = true;
  }

  if(styles['color']) {
    if (styles['color'].indexOf('#') === -1) {
      result['color'] = transformCssColorNamesIntoHexValues(styles['color']);
    } else {
      result['color'] = styles['color'];
    }
  }

  if(styles['background-color']) {
    if (styles['background-color'].indexOf('#') === -1) {
      result['highlight'] = transformCssColorNamesIntoHexValues(styles['background-color']);
      result['shading'] = { fill: transformCssColorNamesIntoHexValues(styles['background-color'])};

    } else {
      result['highlight'] = styles['background-color'];
      result['shading'] = { fill: styles['background-color'] };
    }
  }

  return result;
}


/**
 * Returns the alignment value that is used in the docx library
 * by the given alignment value from the HTML style
 * @param alignmentValue 
 * @returns 
 */
export function getAlignment(alignmentValue: any)
: (typeof AlignmentType)[keyof typeof AlignmentType] {
  switch (alignmentValue) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.BOTH;
    default:
      return AlignmentType.LEFT;
  }
}

/**
 * Returns the vertical alignment value that is used in the docx library
 *  by the given alignment value from the HTML style
 * @param alignmentValue 
 * @returns 
 */
export function getVerticalAlignment(alignmentValue: any): (typeof VerticalAlign)[keyof typeof VerticalAlign] {
  switch (alignmentValue) {
    case 'center':
    case 'middle':
      return VerticalAlign.CENTER;
    case 'bottom':
      return VerticalAlign.BOTTOM;
    default:
      return VerticalAlign.TOP;
  }
}

/**
 * Converts CSS color names to hex values
 * @param color - CSS color name (case-insensitive)
 * @returns Hex color value, defaults to white (#ffffff) if color not found
 */
export function transformCssColorNamesIntoHexValues(color: string): string {
  if (!color) {
    return '#ffffff';
  }
  
  const normalizedColor = color.toLowerCase().trim();
  return CSS_COLOR_MAP[normalizedColor] ?? '#ffffff';
}


export function isLineBlockElement(element: IHtmlElement) {
  return element.type === 'tag' && ['br', 'hr', 'img', 'strong', 'b', 'i', 'em', 'u', 's', 'sup', 'sub'].includes(element.name);
}

export function isTextElement(element: IHtmlElement) {
  return element.type === 'text';
}

export function isTagElement(element: IHtmlElement) {
  return element.type === 'tag';
}