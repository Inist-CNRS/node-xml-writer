function XMLWriter(options) {
	options = options || {};
	var output = '';
	
	this.toString = function() {
		return output;
	};

	function write(s) {
		output += s;
	};

	function attr(s) {
		return '"'+s+'"';
	};

	this.startDocument = function(version, encoding, standalone) {
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
	}
	this.endDocument = function() {
	}
}
module.exports = function (options) { 
	return new XMLWriter(options); 
}
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
	this.endElement = function() { 
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
	this.startElement = function() { 
	}
	this.startPI = function() {
	}
	this.text = function() {
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
