import { Alignment, AlignmentType, UnderlineType, VerticalAlign } from "docx";
import { IHtmlElement, IStyles } from "../handlers/models";

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

  // if(styles['font-family']) {
  //   result['font'] = styles['font-family'];
  // }

  // if(styles['font-size']) {
  //   // convert if px to pt 
  //   if(styles['font-size'].indexOf('px') > -1) {
  //     const size = styles['font-size'].replace('px', '');
  //     result['size'] = `${Math.round(parseInt(size))}pt`;
  //   } else {
  //     result['size'] = styles['font-size'];
  //   }
  // }

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

export function transformCssColorNamesIntoHexValues(color: string) {
  switch (color) {
    case 'white':
    case 'transparent': return '#ffffff';
    case 'black': return '#000000';
    case 'red': return '#ff0000';
    case 'green': return '#00ff00';
    case 'blue': return '#0000ff';
    case 'yellow': return '#ffff00';
    case 'orange': return '#ffa500';
    case 'purple': return '#800080';
    case 'brown': return '#a52a2a';
    case 'grey': return '#808080';
    case 'aqua': return '#00ffff';
    case 'fuchsia': return '#ff00ff';
    case 'lime': return '#00ff00';
    case 'maroon': return '#800000';
    case 'navy': return '#000080';
    case 'olive': return '#808000';
    case 'silver': return '#c0c0c0';
    case 'teal': return '#008080';
    case 'violet': return '#ee82ee';
    case 'pink': return '#ffc0cb';
    case 'indigo': return '#4b0082';
    case 'crimson': return '#dc143c';
    case 'coral': return '#ff7f50';
    case 'cyan': return '#00ffff';
    case 'magenta': return '#ff00ff';
    case 'gold': return '#ffd700';
    case 'khaki': return '#f0e68c';
    case 'plum': return '#dda0dd';
    case 'snow': return '#fffafa';
    case 'tan': return '#d2b48c';
    case 'tomato': return '#ff6347';
    case 'wheat': return '#f5deb3';
    case 'aliceblue': return '#f0f8ff';
    case 'antiquewhite': return '#faebd7';
    case 'aquamarine': return '#7fffd4';
    case 'azure': return '#f0ffff';
    case 'beige': return '#f5f5dc';
    case 'bisque': return '#ffe4c4';
    case 'blanchedalmond': return '#ffebcd';
    case 'blueviolet': return '#8a2be2';
    case 'burlywood': return '#deb887';
    case 'cadetblue': return '#5f9ea0';
    case 'chartreuse': return '#7fff00';
    case 'chocolate': return '#d2691e';
    case 'coral': return '#ff7f50';
    case 'cornflowerblue': return '#6495ed';
    case 'cornsilk': return '#fff8dc';
    case 'crimson': return '#dc143c';
    case 'darkblue': return '#00008b';
    case 'darkcyan': return '#008b8b';
    case 'darkgoldenrod': return '#b8860b';
    case 'darkgray': return '#a9a9a9';
    case 'darkgreen': return '#006400';
    case 'darkgrey': return '#a9a9a9';
    case 'darkkhaki': return '#bdb76b';
    case 'darkmagenta': return '#8b008b';
    case 'darkolivegreen': return '#556b2f';
    case 'darkorange': return '#ff8c00';
    case 'darkorchid': return '#9932cc';
    case 'darkred': return '#8b0000';
    case 'darksalmon': return '#e9967a';
    case 'darkseagreen': return '#8fbc8f';
    case 'darkslateblue': return '#483d8b';
    case 'darkslategray': return '#2f4f4f';
    case 'darkslategrey': return '#2f4f4f';
    case 'darkturquoise': return '#00ced1';
    case 'darkviolet': return '#9400d3';
    case 'deeppink': return '#ff1493';
    case 'deepskyblue': return '#00bfff';
    case 'dimgray': return '#696969';
    case 'dimgrey': return '#696969';
    case 'dodgerblue': return '#1e90ff';
    case 'firebrick': return '#b22222';
    case 'floralwhite': return '#fffaf0';
    case 'forestgreen': return '#228b22';
    case 'gainsboro': return '#dcdcdc';
    case 'ghostwhite': return '#f8f8ff';
    case 'goldenrod': return '#daa520';
    case 'greenyellow': return '#adff2f';
    case 'honeydew': return '#f0fff0';
    case 'hotpink': return '#ff69b4';
    case 'indianred': return '#cd5c5c';
    case 'ivory': return '#fffff0';
    case 'lavender': return '#e6e6fa';
    case 'lavenderblush': return '#fff0f5';
    case 'lawngreen': return '#7cfc00';
    case 'lemonchiffon': return '#fffacd';
    case 'lightblue': return '#add8e6';
    case 'lightcoral': return '#f08080';
    case 'lightcyan': return '#e0ffff';
    case 'lightgoldenrodyellow': return '#fafad2';
    case 'lightgray': return '#d3d3d3';
    case 'lightgreen': return '#90ee90';
    case 'lightgrey': return '#d3d3d3';
    case 'lightpink': return '#ffb6c1';
    case 'lightsalmon': return '#ffa07a';
    case 'lightseagreen': return '#20b2aa';
    case 'lightskyblue': return '#87cefa';
    case 'lightslategray': return '#778899';
    case 'lightslategrey': return '#778899';
    case 'lightsteelblue': return '#b0c4de';
    case 'lightyellow': return '#ffffe0';
    case 'limegreen': return '#32cd32';
    case 'linen': return '#faf0e6';
    case 'mediumaquamarine': return '#66cdaa';
    case 'mediumblue': return '#0000cd';
    case 'mediumorchid': return '#ba55d3';
    case 'mediumpurple': return '#9370db';
    case 'mediumseagreen': return '#3cb371';
    case 'mediumslateblue': return '#7b68ee';
    case 'mediumspringgreen': return '#00fa9a';
    case 'mediumturquoise': return '#48d1cc';
    case 'mediumvioletred': return '#c71585';
    case 'midnightblue': return '#191970';
    case 'mintcream': return '#f5fffa';
    case 'mistyrose': return '#ffe4e1';
    case 'moccasin': return '#ffe4b5';
    case 'oldlace': return '#fdf5e6';
    case 'olivedrab': return '#6b8e23';
    case 'orangered': return '#ff4500';
    case 'orchid': return '#da70d6';
    case 'palegoldenrod': return '#eee8aa';
    case 'palegreen': return '#98fb98';
    case 'paleturquoise': return '#afeeee';
    case 'palevioletred': return '#db7093';
    case 'papayawhip': return '#ffefd5';
    case 'peachpuff': return '#ffdab9';
    case 'peru': return '#cd853f';
    case 'powderblue': return '#b0e0e6';
    case 'rosybrown': return '#bc8f8f';
    case 'royalblue': return '#4169e1';
    case 'saddlebrown': return '#8b4513';
    case 'sandybrown': return '#f4a460';
    case 'seagreen': return '#2e8b57';
    case 'seashell': return '#fff5ee';
    case 'sienna': return '#a0522d';
    case 'skyblue': return '#87ceeb';
    case 'slateblue': return '#6a5acd';
    case 'slategray': return '#708090';
    case 'slategrey': return '#708090';
    case 'springgreen': return '#00ff7f';
    case 'steelblue': return '#4682b4';
    case 'thistle': return '#d8bfd8';
    case 'whitesmoke': return '#f5f5f5';
    case 'yellowgreen': return '#9acd32';
    case 'rebeccapurple': return '#663399';    
    default: return '#ffffff';
  }
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