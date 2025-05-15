declare module 'mammoth' {
  interface ConversionOptions {
    styleMap?: string[];
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    convertImage?: (image: any) => Promise<{ src: string }>;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
    transformDocument?: (document: any) => any;
  }

  interface ConversionResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
      href?: string;
    }>;
  }

  function convertToHtml(input: Buffer | { arrayBuffer: () => Promise<ArrayBuffer> }, options?: ConversionOptions): Promise<ConversionResult>;
  function extractRawText(input: Buffer | { arrayBuffer: () => Promise<ArrayBuffer> }): Promise<ConversionResult>;

  export = {
    convertToHtml,
    extractRawText
  };
}
