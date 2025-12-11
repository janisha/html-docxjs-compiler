import { IHtmlElement } from '../models';

/**
 * Filter children by tag names
 * @param html - HTML element to filter
 * @param tags - Array of tag names to filter by
 * @returns Filtered children elements
 */
export function getChildrenWithTags(
  html: IHtmlElement,
  tags: string[],
): IHtmlElement[] {
  return html.children.filter((child: IHtmlElement) =>
    tags.includes(child.name),
  );
}

/**
 * Check if element has attribute with minimum value
 * @param element - HTML element to check
 * @param attrName - Attribute name
 * @param minValue - Minimum value
 * @returns True if attribute exists and meets minimum value
 */
export function hasAttributeWithMinValue(
  element: IHtmlElement,
  attrName: string,
  minValue: number,
): boolean {
  const value = element.attribs?.[attrName];
  return value !== undefined && parseInt(value, 10) > minValue;
}
