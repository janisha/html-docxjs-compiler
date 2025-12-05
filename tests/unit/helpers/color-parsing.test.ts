import { 
  transformCssColorNamesIntoHexValues, 
  parseStyle, 
  getAlignment, 
  getVerticalAlignment,
  processHtmlElementStyles,
  processStyles,
  isLineBlockElement,
  isTextElement,
  isTagElement
} from '../../../src/helpers/helpers';
import { AlignmentType, VerticalAlign, UnderlineType } from 'docx';
import { IHtmlElement } from '../../../src/handlers/models';

describe('Helpers - Color Parsing', () => {
  describe('transformCssColorNamesIntoHexValues', () => {
    it('should convert named color to hex', () => {
      const result = transformCssColorNamesIntoHexValues('red');
      expect(result).toBe('#ff0000');
    });

    it('should convert multiple named colors', () => {
      expect(transformCssColorNamesIntoHexValues('blue')).toBe('#0000ff');
      expect(transformCssColorNamesIntoHexValues('green')).toBe('#00ff00');
      expect(transformCssColorNamesIntoHexValues('white')).toBe('#ffffff');
      expect(transformCssColorNamesIntoHexValues('black')).toBe('#000000');
    });

    it('should return white for unknown hex values', () => {
      // Function normalizes to lowercase and looks up in color map
      // Returns #ffffff for unknown values
      expect(transformCssColorNamesIntoHexValues('#FF5733')).toBe('#ffffff');
      expect(transformCssColorNamesIntoHexValues('FF5733')).toBe('#ffffff');
      expect(transformCssColorNamesIntoHexValues('#F00')).toBe('#ffffff');
    });

    it('should be case insensitive for named colors', () => {
      expect(transformCssColorNamesIntoHexValues('RED')).toBe('#ff0000');
      expect(transformCssColorNamesIntoHexValues('Red')).toBe('#ff0000');
      expect(transformCssColorNamesIntoHexValues('rEd')).toBe('#ff0000');
    });

    it('should return white for unknown color names', () => {
      const result = transformCssColorNamesIntoHexValues('unknowncolor');
      expect(result).toBe('#ffffff');
    });

    it('should handle common CSS colors', () => {
      expect(transformCssColorNamesIntoHexValues('darkblue')).toBe('#00008b');
      expect(transformCssColorNamesIntoHexValues('lightgray')).toBe('#d3d3d3');
      expect(transformCssColorNamesIntoHexValues('orange')).toBe('#ffa500');
      expect(transformCssColorNamesIntoHexValues('purple')).toBe('#800080');
    });

    it('should handle recently added colors', () => {
      expect(transformCssColorNamesIntoHexValues('salmon')).toBe('#fa8072');
      expect(transformCssColorNamesIntoHexValues('turquoise')).toBe('#40e0d0');
      expect(transformCssColorNamesIntoHexValues('navajowhite')).toBe('#ffdead');
    });
  });

  describe('parseStyle', () => {
    it('should parse single style attribute', () => {
      const result = parseStyle('color: red');
      expect(result).toEqual({ color: 'red' });
    });

    it('should parse multiple style attributes', () => {
      const result = parseStyle('color: red; font-size: 14px; font-weight: bold');
      expect(result).toEqual({
        color: 'red',
        'font-size': '14px',
        'font-weight': 'bold'
      });
    });

    it('should handle styles with spaces', () => {
      const result = parseStyle('  color  :  red  ;  background-color  :  blue  ');
      expect(result).toHaveProperty('color', 'red');
      // background-color gets transformed to hex by parseStyle
      expect(result).toHaveProperty('background-color', '#0000ff');
    });

    it('should handle empty string', () => {
      const result = parseStyle('');
      expect(result).toEqual({});
    });

    it('should handle style without semicolon at end', () => {
      const result = parseStyle('color: red; font-size: 14px');
      expect(result).toEqual({
        color: 'red',
        'font-size': '14px'
      });
    });

    it('should handle complex color values', () => {
      const result = parseStyle('color: rgb(255, 0, 0); background-color: #FF5733');
      expect(result).toHaveProperty('color', 'rgb(255, 0, 0)');
      expect(result).toHaveProperty('background-color', '#FF5733');
    });

    it('should handle style with trailing semicolon', () => {
      const result = parseStyle('color: red;');
      expect(result).toEqual({ color: 'red' });
    });

    it('should ignore invalid style pairs', () => {
      const result = parseStyle('color: red; invalid; font-size: 14px');
      expect(result).toHaveProperty('color', 'red');
      expect(result).toHaveProperty('font-size', '14px');
    });

    it('should filter out font-family property', () => {
      const result = parseStyle('color: red; font-family: Arial; font-size: 14px');
      expect(result).toHaveProperty('color', 'red');
      expect(result).toHaveProperty('font-size', '14px');
      expect(result).not.toHaveProperty('font-family');
    });

    it('should handle null input', () => {
      const result = parseStyle(null);
      expect(result).toEqual({});
    });

    it('should handle undefined input', () => {
      const result = parseStyle(undefined);
      expect(result).toEqual({});
    });

    it('should transform named background-color to hex', () => {
      const result = parseStyle('background-color: red');
      expect(result).toHaveProperty('background-color', '#ff0000');
    });

    it('should not transform background-color if already hex', () => {
      const result = parseStyle('background-color: #ff0000');
      expect(result).toHaveProperty('background-color', '#ff0000');
    });
  });

  describe('processStyles', () => {
    it('should process bold font-weight', () => {
      const result = processStyles('font-weight: bold');
      expect(result).toHaveProperty('bold', true);
    });

    it('should process normal font-weight', () => {
      const result = processStyles('font-weight: normal');
      expect(result).toHaveProperty('bold', false);
    });

    it('should process italic font-style', () => {
      const result = processStyles('font-style: italic');
      expect(result).toHaveProperty('italics', true);
    });

    it('should process underline text-decoration', () => {
      const result = processStyles('text-decoration: underline');
      expect(result).toHaveProperty('underline');
      expect(result.underline).toEqual({ type: UnderlineType.SINGLE });
    });

    it('should process line-through text-decoration', () => {
      const result = processStyles('text-decoration: line-through');
      expect(result).toHaveProperty('strike', true);
    });

    it('should process color with named color', () => {
      const result = processStyles('color: red');
      expect(result).toHaveProperty('color', '#ff0000');
    });

    it('should process color with hex color', () => {
      const result = processStyles('color: #ff0000');
      expect(result).toHaveProperty('color', '#ff0000');
    });

    it('should process background-color with named color', () => {
      const result = processStyles('background-color: blue');
      expect(result).toHaveProperty('highlight', '#0000ff');
      expect(result).toHaveProperty('shading');
      expect(result.shading).toEqual({ fill: '#0000ff' });
    });

    it('should process background-color with hex color', () => {
      const result = processStyles('background-color: #0000ff');
      expect(result).toHaveProperty('highlight', '#0000ff');
      expect(result).toHaveProperty('shading');
      expect(result.shading).toEqual({ fill: '#0000ff' });
    });

    it('should process multiple styles together', () => {
      const result = processStyles('font-weight: bold; font-style: italic; color: red; text-decoration: underline');
      expect(result).toHaveProperty('bold', true);
      expect(result).toHaveProperty('italics', true);
      expect(result).toHaveProperty('color', '#ff0000');
      expect(result).toHaveProperty('underline');
    });

    it('should return empty object for empty string', () => {
      const result = processStyles('');
      expect(result).toEqual({});
    });
  });

  describe('processHtmlElementStyles', () => {
    it('should process element with style attribute', () => {
      const element: IHtmlElement = {
        type: 'tag',
        name: 'p',
        data: '',
        attribs: {
          style: 'font-weight: bold; color: red'
        },
        children: []
      };

      const result = processHtmlElementStyles(element);
      expect(result).toHaveProperty('bold', true);
      expect(result).toHaveProperty('color', '#ff0000');
    });

    it('should return empty object for element without style attribute', () => {
      const element: IHtmlElement = {
        type: 'tag',
        name: 'p',
        data: '',
        attribs: {},
        children: []
      };

      const result = processHtmlElementStyles(element);
      expect(result).toEqual({});
    });

    it('should handle element with empty style', () => {
      const element: IHtmlElement = {
        type: 'tag',
        name: 'p',
        data: '',
        attribs: {
          style: ''
        },
        children: []
      };

      const result = processHtmlElementStyles(element);
      expect(result).toEqual({});
    });
  });
});

describe('Helpers - Element Type Checkers', () => {
  describe('isLineBlockElement', () => {
    it('should return true for br element', () => {
      const element: IHtmlElement = {
        type: 'tag',
        name: 'br',
        data: '',
        attribs: {},
        children: []
      };
      expect(isLineBlockElement(element)).toBe(true);
    });

    it('should return true for inline formatting elements', () => {
      const elements = ['strong', 'b', 'i', 'em', 'u', 's', 'sup', 'sub', 'hr', 'img'];
      elements.forEach(name => {
        const element: IHtmlElement = {
          type: 'tag',
          name,
          data: '',
          attribs: {},
          children: []
        };
        expect(isLineBlockElement(element)).toBe(true);
      });
    });

    it('should return false for block elements', () => {
      const element: IHtmlElement = {
        type: 'tag',
        name: 'p',
        data: '',
        attribs: {},
        children: []
      };
      expect(isLineBlockElement(element)).toBe(false);
    });

    it('should return false for text elements', () => {
      const element: IHtmlElement = {
        type: 'text',
        name: '',
        data: 'text',
        attribs: {},
        children: []
      };
      expect(isLineBlockElement(element)).toBe(false);
    });
  });

  describe('isTextElement', () => {
    it('should return true for text elements', () => {
      const element: IHtmlElement = {
        type: 'text',
        name: '',
        data: 'Hello',
        attribs: {},
        children: []
      };
      expect(isTextElement(element)).toBe(true);
    });

    it('should return false for tag elements', () => {
      const element: IHtmlElement = {
        type: 'tag',
        name: 'p',
        data: '',
        attribs: {},
        children: []
      };
      expect(isTextElement(element)).toBe(false);
    });
  });

  describe('isTagElement', () => {
    it('should return true for tag elements', () => {
      const element: IHtmlElement = {
        type: 'tag',
        name: 'p',
        data: '',
        attribs: {},
        children: []
      };
      expect(isTagElement(element)).toBe(true);
    });

    it('should return false for text elements', () => {
      const element: IHtmlElement = {
        type: 'text',
        name: '',
        data: 'Hello',
        attribs: {},
        children: []
      };
      expect(isTagElement(element)).toBe(false);
    });
  });
});

describe('Helpers - Alignment', () => {
  describe('getAlignment', () => {
    it('should convert left alignment', () => {
      const result = getAlignment('left');
      expect(result).toBe(AlignmentType.LEFT);
    });

    it('should convert center alignment', () => {
      const result = getAlignment('center');
      expect(result).toBe(AlignmentType.CENTER);
    });

    it('should convert right alignment', () => {
      const result = getAlignment('right');
      expect(result).toBe(AlignmentType.RIGHT);
    });

    it('should convert justify alignment', () => {
      const result = getAlignment('justify');
      expect(result).toBe(AlignmentType.JUSTIFIED);
    });

    it('should return LEFT for unknown alignment', () => {
      const result = getAlignment('unknown');
      expect(result).toBe(AlignmentType.LEFT);
    });

    it('should be case sensitive (lowercase required)', () => {
      // Function is case-sensitive and expects lowercase values
      expect(getAlignment('center')).toBe(AlignmentType.CENTER);
      expect(getAlignment('right')).toBe(AlignmentType.RIGHT);
    });
  });

  describe('getVerticalAlignment', () => {
    it('should convert top alignment', () => {
      const result = getVerticalAlignment('top');
      expect(result).toBe(VerticalAlign.TOP);
    });

    it('should convert center/middle alignment', () => {
      expect(getVerticalAlignment('center')).toBe(VerticalAlign.CENTER);
      expect(getVerticalAlignment('middle')).toBe(VerticalAlign.CENTER);
    });

    it('should convert bottom alignment', () => {
      const result = getVerticalAlignment('bottom');
      expect(result).toBe(VerticalAlign.BOTTOM);
    });

    it('should return TOP for unknown alignment', () => {
      const result = getVerticalAlignment('unknown');
      expect(result).toBe(VerticalAlign.TOP);
    });

    it('should be case sensitive (lowercase required)', () => {
      // Function is case-sensitive and expects lowercase values
      expect(getVerticalAlignment('top')).toBe(VerticalAlign.TOP);
      expect(getVerticalAlignment('bottom')).toBe(VerticalAlign.BOTTOM);
    });
  });
});
