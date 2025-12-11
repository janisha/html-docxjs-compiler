import { ImageRun, XmlComponent } from 'docx';
import { IHtmlElement, IStyles } from './models';
import { processHtmlElementStyles } from '../helpers/helpers';
import { IMAGE_CONSTRAINTS } from '../helpers/constants';
import imageSize from 'image-size';
import { ImageDownloadStrategyManager } from '../strategies';

export async function handleImage(
  element: IHtmlElement,
  styles: IStyles = {},
  strategyManager?: ImageDownloadStrategyManager,
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  const stylesMerged = {
    ...styles,
    ...elementStyles,
  };

  const href = element.attribs['src'];
  
  if (!href) {
    return [];
  }

  // Handle base64 data URIs directly
  let imageData: string;
  if (href.startsWith('data:image')) {
    imageData = href;
  } else {
    // Try to download image using strategy manager
    if (!strategyManager) {
      console.warn(
        `Image download skipped for "${href}": No image download strategy configured. ` +
        `Please provide a strategyManager in the options to download images from URLs. ` +
        `You can use HttpImageDownloadStrategy or implement a custom strategy.`
      );
      return [];
    }
    
    try {
      imageData = await strategyManager.download(href);
    } catch (error) {
      console.warn(
        `Failed to download image from "${href}": ${error instanceof Error ? error.message : String(error)}`
      );
      return [];
    }
  }

  try {
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const p = imageSize(buffer);

    const dimensions = { w: p.width, h: p.height };

    let imageWidth = dimensions.w;
    let imageHeight = dimensions.h;

    if (dimensions.w! > IMAGE_CONSTRAINTS.MAX_WIDTH) {
      imageWidth = IMAGE_CONSTRAINTS.MAX_WIDTH;
      imageHeight = (dimensions.h! / dimensions.w!) * imageWidth;
    } else if (dimensions.h! > IMAGE_CONSTRAINTS.MAX_HEIGHT) {
      imageHeight = IMAGE_CONSTRAINTS.MAX_HEIGHT;
      imageWidth = (dimensions.w! / dimensions.h!) * imageHeight;
    } else if (dimensions.w! < IMAGE_CONSTRAINTS.MAX_WIDTH && dimensions.h! < IMAGE_CONSTRAINTS.MAX_HEIGHT) {
      imageWidth = dimensions.w!;
      imageHeight = dimensions.h!;
    }

    items.push(
      new ImageRun({
        data: imageData,
        transformation: {
          width: imageWidth!,
          height: imageHeight!,
        },
      }),
    );

    return items;
  } catch (error) {
    // Image processing failed, return empty array
    return [];
  }
}
