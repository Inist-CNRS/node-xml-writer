function cbtest(haystack, needle) {
	return (haystack & needle) == needle;
}	
function XMLWriter(options) {
	if (!(this instanceof XMLWriter)) {
		return new XMLWriter();
	}
	options = options || {};
	var output = '';
	var stack = [];
	var tags = 0;
	var attributes = 0;
	var attribute = 0;
	var texts = 0;
	var comment = 0;
	var pi = 0;

	
	this.toString = function() {
		this.flush();
		return output;
	}

	function write() {
		 for (var i = 0; i < arguments.length; i++) {
			 output += arguments[i];
		 }
	 }

	function attr(s) {
		return '"'+s.replace('"', '&quot;')+'"';
	}

	this.flush = function() {
		for(var i = tags; i > 0; i--) {
			this.endElement();
		}
		tags = 0;
	}


	this.startDocument = function(version, encoding, standalone) {
		if (tags || attributes) return;

		this.startPI('xml');
		this.startAttribute('version');
		this.text(typeof version == "string" ? version : "1.0");
		this.endAttribute();
		if (typeof encoding == "string") {
			this.startAttribute('encoding');
			this.text(encoding);
			this.endAttribute();
		}
		if (standalone) {
			this.startAttribute('standalone');
			this.text("yes");
			this.endAttribute();
		}
		this.endPI();
		write('\n');
	}

	this.endDocument = function() {
		if (attributes) this.endAttributes();
	}

	this.startElement = function(name) { 
		if (attributes) this.endAttributes();
		++tags;
		texts = 0;
		stack.push({ name:name, tags:tags});
		write('<',name);
		this.startAttributes();
	}

	this.startAttributes = function() {
		attributes = 1;
	}

	this.endAttributes = function() {
		if (!attributes)  return;
		if (attribute) this.endAttribute();
		attributes = 0;
		attribute = 0;
		texts = 0;
		write('>');
	}

	this.startAttribute = function(name) { 
		if (!attributes && !pi) return;
		if (attribute) return;
		attribute = 1;
		write(' ',name,'="');
		
	}
	this.endAttribute = function() {
		if (!attribute) return;
		attribute = 0;
		texts = 0;
		write('"');
	}


	this.text = function(value) {	
		if (!tags && !comment && !pi)	return;
		if (attributes && attribute) {
			++texts;
			write(value.replace('"', '&quot;'));
			return;
		}
		else if(attributes && !attribute) {
			this.endAttributes();
		}
		++texts;
		write(value.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
	}

	this.endElement = function() { 
		if (!tags) return;	
		if (attributes > 0) {
			if (attribute) {
				if (texts) this.endAttribute();
				this.endAttribute();
			}
			write('/');
			this.endAttributes();
		}
		else if (tags) {
			var t = stack.pop();
			write('</',t.name,'>');
		}
		--tags;
		texts = 0;
	}
	this.startComment = function() {
		if (comment) return;
		if (attributes) this.endAttributes();
		write('<!--');
		comment = 1;
	}
	this.endComment = function() {
		if (!comment) return;
		write('-->');
		comment = 0;
	}
	this.startPI = function(name) {
		if (pi) return;
		if (attributes) this.endAttributes();
		write('<?',name);
		pi = 1;
	}
	this.endPI = function() {
		if (!pi) return;
		write('?>');
		pi = 0;
	}
}
module.exports = XMLWriter;
/*	
this.endCData = function() {
	}
		this.endDTDAttlist = function() {
	}
	this.endDTDElement = function() {
	}
	this.endDTDEntity = function() { 
	}
	this.endDTD = function() {
	}
		this.flush = function() {
	}
	this.fullEndElement = function() { 
	}
	this.openMemory = function() {
	}
	this.openURI = function() {
	}
	this.outputMemory = function() {
	}
	this.setIndentString = function() { 
	}
	this.setIndent = function() {
	}
	this.startAttributeNs = function() {
	}
	this.startCData = function() {
	}

	this.startDTDAttlist = function() {
	}
	this.startDTDElement = function() {
	}
	this.startDTDEntity = function() { 
	}
	this.startDTD = function() {
	}
	this.startElementNs = function() {
	}


	this.writeAttributeNs = function() {
	}
	this.writeAttribute = function() { 
	}
	this.writeCData = function() {
	}
	this.writeComment = function() {
	}
	this.writeDTDAttlist = function() {
	}
	this.writeDTDElement = function() {
	}
	this.writeDTDEntity = function() { 
	}
	this.writeDTD = function() {
	}
	this.writeElementNS = function() {
	}
	this.writeElement = function() { 
	}
	this.writePI = function() { 
	}
	this.writeRaw = function() { 
	}


	## DTDAttlist

### writeDTDAttlist
Write full DTD AttList tag

### startDTDAttlist
Create start DTD AttList

### endDTDAttlist
End current DTD AttList

## DTDElement

### writeDTDElement 
Write full DTD element tag

### startDTDElement
Create start DTD element

### endDTDElement
End current DTD element

### writeDTDEntity
Write full DTD Entity tag

### startDTDEntity
Create start DTD Entity

### endDTDEntity
End current DTD Entity

## DTD

### writeDTD
Write full DTD tag

### startDTD
Create start DTD tag

### endDTD
End current DTD


*/
