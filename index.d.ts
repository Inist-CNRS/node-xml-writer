declare module "xml-writer" {
  type PrimitiveType = string | number | boolean;

  export default class XMLWriter {
    public toString(): string;
    public indenter(): void;
    public write(): void;
    public flush(): void;
    public startDocument(version: string, encoding: string): void;
    public startDocument(
      version: string,
      encoding: string,
      standalone: boolean
    ): this;
    public endDocument(): this;
    public writeElement(name: string, content: string): this;
    public writeElementNS(prefix: string, name: string, uri: string): this;
    public writeElementNS(
      prefix: string,
      name: string,
      uri: string,
      content: string
    ): this;
    public startDocument(name: string): this;
    public startElementNS(prefix: string, name: string, uri: string): this;
    public startElement(name: string): this;
    public endElement(): this;
    public writeAttribute(name: string, content: PrimitiveType): this;
    public writeAttributeNS(prefix: string, name: string, uri: string): this;
    public writeAttributeNS(
      prefix: string,
      name: string,
      uri: string,
      content: PrimitiveType
    ): this;
    public startAttributes(): this;
    public startAttributes(): this;
    public startAttribute(name: string): this;
    public startAttributeNS(prefix: string, name: string, uri: string): this;
    public endAttribute(): this;
    public text(content: PrimitiveType): this;
    public writeComment(content: string): this;
    public startComment(): this;
    public endComment(): this;
    public writeDocType(
      name: string,
      pubid: string,
      sysid: string,
      subset: string
    ): this;
    public startDocType(
      name: string,
      pubid: string,
      sysid: string,
      subset: string
    ): this;
    public endDocType(): this;
    public writePI(name: string, content: PrimitiveType): this;
    public startPI(name: string): this;
    public endPi(content: PrimitiveType): this;
    public writeCData(content: PrimitiveType): this;
    public startCData(): this;
    public endCData(): this;
    public writeRaw(content: PrimitiveType): this;
  }
}
