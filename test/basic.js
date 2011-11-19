var XMLWriter = require('../')();

exports['test'] = function (test) {
	XMLWriter.startDocument();
	console.log(XMLWriter.toString());
    test.done();
};
