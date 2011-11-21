# XMLWriter for NodeJS

It\'s native and full javascript implementation of the classic XMLWriter class.
The API is complete, flexible and tolerant.
XML is still valid.

# Installation

With [npm](http://npmjs.org) do:

    $ npm install xml-writer


# Examples

## Basic

	var XMLWriter = require('xml-writer');
	xw = new XMLWriter;
	xw.startDocument();
	xw.startElement('root');
	xw.text('Some content');
	xw.endDocument();

	console.log(xw.toString());

Output:


    <?xml version="1.0"?>
	<root>Some content</root>

	
# Tests

Use [nodeunit](https://github.com/caolan/nodeunit) to run the tests.

    $ npm install nodeunit
    $ nodeunit test

# API Documentation

## startDocument(String version = '1.0', String encoding = NULL, Boolean standalone = false) 

Create document tag

# Also

* https://github.com/minchenkov/simple-xml-writer

# License:

[MIT/X11](./LICENSE)
