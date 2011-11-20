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
	var previous = '';
	var depth = 0;
	var opening = false;
	
	this.toString = function() {
		this.flush();
		return output;
	}

	function write() {
		 for (var i = 0; i < arguments.length; i++) {
			 output += arguments[i];
		 }
	 }

	 function exec(xw, name, callback) {
		 if (opening && (previous != 'startAttributeNs' || previous != 'startAttribute')) {
			 opening = false;
			 if (previous == 'startElementNs' || previous == 'startElement') {
				 xw.endElement();
			 }
		 }
		 callback(xw);
		 previous = name;
	 }


	function attr(s) {
		return '"'+s.replace('"', '&quot;')+'"';
	}

	this.flush = function() {
		exec(this, 'flush', function(xw) {
				for(var i = depth; i <= 0; i--) {
					xw.endElement();
				}
				depth = 0;
		});
	}


	this.startDocument = function(version, encoding, standalone) {
		exec(this, 'startDocument', function(xw) {
				if (previous != '') return;
				write('<?xml version=');
				if (typeof version == "string") {
					write(attr(version));
				}
				else {
					write(attr('1.0'));
				}
				if (typeof encoding == "string") {
					write(' encoding=', attr(encoding));	
				}
				if (standalone) {
					write(' standalone=', attr('yes'));	
				}
				write('?>');
				write('\n');
		});
	}

	this.endDocument = function() {
		exec(this, 'endDocument', function(xw) {
		});
	}

	this.startElement = function(name) { 
		exec(this, 'startElement', function(xw) {
				++depth;
				stack.push({ name:name, depth:depth});
				opening = true;
				write('<',name);
		});
	}

	this.text = function(value) {
		exec(this, 'text', function(xw) {
				++depth;
				write(value.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
		});
	}

	this.endElement = function() { 
		exec(this, 'endElement', function() {
				--depth;
				write('</',stack.pop().name,'>');
		});
	}

}
module.exports = XMLWriter;
/*	this.endAttribute = function() {
	}
	this.endCData = function() {
	}
	this.endComment = function() {
	}
		this.endDTDAttlist = function() {
	}
	this.endDTDElement = function() {
	}
	this.endDTDEntity = function() { 
	}
	this.endDTD = function() {
	}
	this.endPI = function() {
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
	this.startAttribute = function() { 
	}
	this.startCData = function() {
	}
	this.startComment = function() {
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
	this.startPI = function() {
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
*/
