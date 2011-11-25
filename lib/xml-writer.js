function XMLWriter(indent, callback) {

	if (!(this instanceof XMLWriter)) {
		return new XMLWriter();
	}

	var name_regex = /[_:A-Za-z][-._:A-Za-z0-9]*/;
	var output = '';
	var stack = [];
	var tags = 0;
	var attributes = 0;
	var attribute = 0;
	var texts = 0;
	var comment = 0;
	var pi = 0;
	var cdata = 0;
	var writer;
	var writer_encoding = 'UTF-8';

	if (typeof callback == 'function') {
		writer = callback;
	}
	else {
		writer = function(s, e) { 
			output += s;
		}
	}

	this.toString = function() {
		this.flush();
		return output;
	}

	function write() {
		for (var i = 0; i < arguments.length; i++) {
			writer(arguments[i], writer_encoding);
		}
	}

	function strval(s) {
		if (typeof s == 'string') {
			return s;
		}
		else if (typeof s == 'function') {
			return s();
		}
		else throw Error('Bad Parameter');
	}

	this.flush = function() {
		for(var i = tags; i > 0; i--) {
			this.endElement();
		}
		tags = 0;
	}


	this.startDocument = function(version, encoding, standalone) {
		if (tags || attributes) return this;

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
		write('\n');
		return this;
	}

	this.endDocument = function() {
		if (attributes) this.endAttributes();
		return this;
	}

	this.writeElement = function(name, content) {
		return this.startElement(name).text(content).endElement();
	}

	this.startElement = function(name) { 
		name = strval(name);
		if (!name.match(name_regex)) throw Error('Invalid Parameter');
		if (attributes) this.endAttributes();
		++tags;
		texts = 0;
		stack.push({ name:name, tags:tags});
		write('<', name);
		this.startAttributes();
		return this;
	}

	this.endElement = function() { 
		if (!tags) return this;	
		var t = stack.pop();
		if (attributes > 0) {
			if (attribute) {
				if (texts) this.endAttribute();
				this.endAttribute();
			}
			write('/');
			this.endAttributes();
		}
		else {
			write('</',t.name,'>');
		}
		--tags;
		texts = 0;
		return this;
	}

	this.writeAttribute = function(name, content) {
		return this.startAttribute(name).text(content).endAttribute();
	}

	this.startAttributes = function() {
		attributes = 1;
		return this;
	}

	this.endAttributes = function() {
		if (!attributes)  return this;
		if (attribute) this.endAttribute();
		attributes = 0;
		attribute = 0;
		texts = 0;
		write('>');
		return this;
	}

	this.startAttribute = function(name) { 
		name = strval(name);
		if (!name.match(name_regex)) throw Error('Invalid Parameter');
		if (!attributes && !pi) return this;
		if (attribute) return this;
		attribute = 1;
		write(' ',name,'="');
		return this;
	}

	this.endAttribute = function() {
		if (!attribute) return this;
		attribute = 0;
		texts = 0;
		write('"');
		return this;	
	}

	this.text = function(content) {	
		content = strval(content);
		if (!tags && !comment && !pi && !cdata) return this;
		if (attributes && attribute) {
			++texts;
			write(content.replace('"', '&quot;'));
			return this;
		}
		else if(attributes && !attribute) {
			this.endAttributes();
		}
		++texts;
		write(content.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
	return this;
}

this.writeComment = function(content) {
	return this.startComment().text(content).endComment();
}

this.startComment = function() {
	if (comment) return this;
	if (attributes) this.endAttributes();
	write('<!--');
	comment = 1;
	return this;
}

this.endComment = function() {
	if (!comment) return this;
	write('-->');
	comment = 0;
	return this;
}

this.writePI = function(name, content) {
	return this.startPI(name).text(content).endPI()
}

this.startPI = function(name) {
	name = strval(name);
	if (!name.match(name_regex)) throw Error('Invalid Parameter');
	if (pi) return this;
	if (attributes) this.endAttributes();
	write('<?', name);
	pi = 1;
	return this;
}
this.endPI = function() {
	if (!pi) return this;
	write('?>');
	pi = 0;
	return this;
}
this.writeCData = function(content) {
	return this.startCData().text(content).endCData();
}
this.startCData = function() {
	if (cdata) return this;
	if (attributes) this.endAttributes();
	write('<![CDATA[');
	cdata = 1;
	return this;
}
this.endCData = function() {
	if (!cdata) return this;
	write(']]>');
	cdata = 0;
	return this;
}

}
module.exports = XMLWriter;
