import { ImageRun, XmlComponent } from 'docx';
import { IHtmlElement, IStyles } from './models';
import { processHtmlElementStyles } from '../helpers/helpers';
import { IMAGE_CONSTRAINTS } from '../helpers/constants';
import fs from 'fs';
import { readFileSync } from 'fs';
import firebase from 'firebase-admin';
import imageSize from 'image-size';
import axios from 'axios';

export async function handleImage(
  element: IHtmlElement,
  styles: IStyles = {},
): Promise<XmlComponent[]> {
  const items: XmlComponent[] = [];
  const elementStyles = processHtmlElementStyles(element);

  const stylesMerged = {
    ...styles,
    ...elementStyles,
  };

  const href = element.attribs['src'];
  let isUrl = true;

  if (href.startsWith('data:image')) {
    isUrl = false;
  }

  const imageData = isUrl ? await getBase64FromImageFile(href) : href;
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

/**
 * Read image from url and return base64 string
 * fs cant be used because it is not available in browser
 * need to be cors agnostic
 * @param filePath
 */
async function getBase64FromImageFile(filePath: string): Promise<any> {
  // get image from firebase storage

  if(!filePath.startsWith('https://firebasestorage.googleapis.com/v0/b/procena-rizika.appspot.com')) {
    // Download image from generic URL using axios
    const file = await downloadImage(filePath);

    return file ?? '';
  } else {
    // Download image from Firebase Storage
    // replace all url characters with proper ones
    filePath = filePath.replace(/%2F/g, '/');
    filePath = filePath.replace(/%3A/g, ':');
    filePath = filePath.replace(/%3F/g, '?');
    filePath = filePath.replace(/%3D/g, '=');
    filePath = filePath.replace(/%26/g, '&');
    filePath = filePath.replace(/%2C/g, ',');
    filePath = filePath.replace(/%3B/g, ';');
    filePath = filePath.replace(/%2B/g, '+');
    filePath = filePath.replace(/%40/g, '@');
    filePath = filePath.replace(/%23/g, '#');
    filePath = filePath.replace(/%25/g, '%');
    filePath = filePath.replace(/%7C/g, '|');
    filePath = filePath.replace('https://firebasestorage.googleapis.com/v0/b/procena-rizika.appspot.com/o/', '');
    // remove all query params
    filePath = filePath.split('?')[0];

    const file = await firebase
      .storage()
      .bucket('procena-rizika.appspot.com')
      .file(filePath)
      .download()
      .then((data) => {
        const base64 = Buffer.from(data[0]).toString('base64');
        //set base64 to image src
        return 'data:image/png;base64,' + base64;
        // return buffer;
      });

    return file;
  }
}

async function downloadImage(imagePath: string): Promise<string | undefined>  {
  try {
   //get image from url and return base64 string as result
    const response = await axios.get(imagePath, {
      responseType: 'arraybuffer',
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    return 'data:image/png;base64,' + base64;
  } catch (error) {
    // Image download failed
    return undefined;
  }
}
