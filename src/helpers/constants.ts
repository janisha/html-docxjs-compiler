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


/**
 * CSS color name to hex value mapping
 * Covers all standard CSS named colors
 */
export const CSS_COLOR_MAP: Record<string, string> = {
  // Basic colors
  white: '#ffffff',
  transparent: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  yellow: '#ffff00',
  orange: '#ffa500',
  purple: '#800080',
  brown: '#a52a2a',
  grey: '#808080',
  gray: '#808080',
  
  // Extended colors
  aqua: '#00ffff',
  fuchsia: '#ff00ff',
  lime: '#00ff00',
  maroon: '#800000',
  navy: '#000080',
  olive: '#808000',
  silver: '#c0c0c0',
  teal: '#008080',
  violet: '#ee82ee',
  pink: '#ffc0cb',
  indigo: '#4b0082',
  crimson: '#dc143c',
  coral: '#ff7f50',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  gold: '#ffd700',
  khaki: '#f0e68c',
  plum: '#dda0dd',
  snow: '#fffafa',
  tan: '#d2b48c',
  tomato: '#ff6347',
  wheat: '#f5deb3',
  
  // Light colors
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  blanchedalmond: '#ffebcd',
  blueviolet: '#8a2be2',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  
  // Dark colors
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgrey: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  
  // Deep colors
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  goldenrod: '#daa520',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  ivory: '#fffff0',
  
  // Lavender/Light colors
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  
  // Medium colors
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  
  // Other colors
  navajowhite: '#ffdead',
  oldlace: '#fdf5e6',
  olivedrab: '#6b8e23',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  powderblue: '#b0e0e6',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  thistle: '#d8bfd8',
  turquoise: '#40e0d0',
  whitesmoke: '#f5f5f5',
  yellowgreen: '#9acd32',
  rebeccapurple: '#663399',
};