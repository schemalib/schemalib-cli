const Parser = require("../../src/parser/parser");

exports.command = 'feathersjs [<schemafile>] [<outputdir>]'
exports.desc = 'Generates a featherjs app boilerplate based on the provided schemadir'
exports.builder = {}
exports.handler = function (argv) {
    let schemaParser = new Parser();

    schemaParser.load(argv.schemafile);
    console.log(JSON.stringify(schemaParser.getRawData(), null, 2));
    console.log(JSON.stringify(schemaParser.getRawErrors(), null, 2));
};
