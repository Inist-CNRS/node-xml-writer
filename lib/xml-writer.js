function strval(s) {
    if (typeof s == 'string') {
        return s;
    } else if (typeof s == 'function') {
        return s();
    } else throw Error('Bad Parameter');
}

function XMLWriter(indent, callback) {

    if (!(this instanceof XMLWriter)) {
        return new XMLWriter();
    }

    this.name_regex = /[_:A-Za-z][-._:A-Za-z0-9]*/;
    this.output = '';
    this.stack = [];
    this.tags = 0;
    this.attributes = 0;
    this.attribute = 0;
    this.texts = 0;
    this.comment = 0;
    this.pi = 0;
    this.cdata = 0;
    this.writer;
    this.writer_encoding = 'UTF-8';

    if (typeof callback == 'function') {
        this.writer = callback;
    } else {
        this.writer = function (s, e) {
            this.output += s;
        }
    }

    this.toString = function () {
        this.flush();
        return this.output;
    }

    this.write = function () {
        for (var i = 0; i < arguments.length; i++) {
            this.writer(arguments[i], this.writer_encoding);
        }
    }


    this.flush = function () {
        for (var i = this.tags; i > 0; i--) {
            this.endElement();
        }
        this.tags = 0;
    }


    this.startDocument = function (version, encoding, standalone) {
        if (this.tags || this.attributes) return this;

        this.startPI('xml');
        this.startAttribute('version');
        this.text(typeof version == "string" ? version : "1.0");
        this.endAttribute();
        if (typeof encoding == "string") {
            this.startAttribute('encoding');
            this.text(encoding);
            this.endAttribute();
            writer_encoding = encoding;
        }
        if (standalone) {
            this.startAttribute('standalone');
            this.text("yes");
            this.endAttribute();
        }
        this.endPI();
        this.write('\n');
        return this;
    }

    this.endDocument = function () {
        if (this.attributes) this.endAttributes();
        return this;
    }

    this.writeElement = function (name, content) {
        return this.startElement(name).text(content).endElement();
    }

    this.startElement = function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.attributes) this.endAttributes();
        ++this.tags;
        this.texts = 0;
        this.stack.push({
            name: name,
            tags: this.tags
        });
        this.write('<', name);
        this.startAttributes();
        return this;
    }

    this.endElement = function () {
        if (!this.tags) return this;
        var t = this.stack.pop();
        if (this.attributes > 0) {
            if (this.attribute) {
                if (this.texts) this.endAttribute();
                this.endAttribute();
            }
            this.write('/');
            this.endAttributes();
        } else {
            this.write('</', t.name, '>');
        }
        --this.tags;
        this.texts = 0;
        return this;
    }

    this.writeAttribute = function (name, content) {
        return this.startAttribute(name).text(content).endAttribute();
    }

    this.startAttributes = function () {
        this.attributes = 1;
        return this;
    }

    this.endAttributes = function () {
        if (!this.attributes) return this;
        if (this.attribute) this.endAttribute();
        this.attributes = 0;
        this.attribute = 0;
        this.texts = 0;
        this.write('>');
        return this;
    }

    this.startAttribute = function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!this.attributes && !this.pi) return this;
        if (this.attribute) return this;
        this.attribute = 1;
        this.write(' ', name, '="');
        return this;
    }

    this.endAttribute = function () {
        if (!this.attribute) return this;
        this.attribute = 0;
        this.texts = 0;
        this.write('"');
        return this;
    }

    this.text = function (content) {
        content = strval(content);
        if (!this.tags && !this.comment && !this.pi && !this.cdata) return this;
        if (this.attributes && this.attribute) {
            ++this.texts;
            this.write(content.replace('"', '&quot;').replace('&', '&amp;'));
            return this;
        } else if (this.attributes && !this.attribute) {
            this.endAttributes();
        }
        ++this.texts;
        this.write(content.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        return this;
    }

    this.writeComment = function (content) {
        return this.startComment().text(content).endComment();
    }

    this.startComment = function () {
        if (this.comment) return this;
        if (this.attributes) this.endAttributes();
        this.write('<!--');
        this.comment = 1;
        return this;
    }

    this.endComment = function () {
        if (!this.comment) return this;
        this.write('-->');
        this.comment = 0;
        return this;
    }

    this.writePI = function (name, content) {
        return this.startPI(name).text(content).endPI()
    }

    this.startPI = function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.pi) return this;
        if (this.attributes) this.endAttributes();
        this.write('<?', name);
        this.pi = 1;
        return this;
    }
    this.endPI = function () {
        if (!this.pi) return this;
        this.write('?>');
        this.pi = 0;
        return this;
    }
    this.writeCData = function (content) {
        return this.startCData().text(content).endCData();
    }
    this.startCData = function () {
        if (this.cdata) return this;
        if (this.attributes) this.endAttributes();
        this.write('<![CDATA[');
        this.cdata = 1;
        return this;
    }
    this.endCData = function () {
        if (!this.cdata) return this;
        this.write(']]>');
        this.cdata = 0;
        return this;
    }

}
module.exports = XMLWriter;