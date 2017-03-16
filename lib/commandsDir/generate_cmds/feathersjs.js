/*jshint esversion: 6 */

const Generate = require("../../src/generator/generate").Generate;
const GenerateEvents = require("../../src/generator/generate").Events;

exports.command = 'feathersjs [<namespaceFile>] [<outputdir>]'
exports.desc = 'Generates a featherjs app boilerplate based on the provided schema namespace-file';
exports.builder = {}
exports.handler = function (argv) {
    let schemaGenerate = new Generate();

    schemaGenerate.load(argv.namespaceFile);
    //console.log(JSON.stringify(schemaGenerate.getRawData(), null, 2));
    console.log(JSON.stringify(schemaGenerate.getRawErrors(), null, 2));
};
