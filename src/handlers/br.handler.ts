import { TextRun, XmlComponent } from "docx";

export async function handleBr(): Promise<XmlComponent[]> {
  return [ new TextRun({ break: 1, text: ''}) ];
}
