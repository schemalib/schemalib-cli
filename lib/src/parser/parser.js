const schemaLibParser           = require("../../grammar/schemalib-language");
const fs                        = require("fs");
const pathExists                = require('path-exists');
const merge                     = require('merge');
const path                      = require('path');
const jsonQuery                 = require('json-query');

/**
 * Parser error ids:
 * 404 - Couldn't find the file
 * 405 - Invalid file extension
 * 500 - Problem Loading the file
 * 501 - Problem Parsing the file
 */

class Parser {

    constructor(options = {}) {
        this.parsedJson = {};
        this.parserErrorFlag = false;
        this.parserErrors = {};

        var optionsDefault = {
            'debug':  false,
            'defaultFileExt': '.slib',
            'throwError': true
        };

        if ( typeof options == "object" ) {
            options = merge(optionsDefault, options);
        }

        this.options = options;

    }


    /**
     * load - Schemalib file *.lib, parse it and load up the json structure to be queried
     *
     * @param  string filePath Path to the file to be parsed
     * @return void
     */
    load( filePath ) {

        if ( !pathExists.sync(filePath) ) {
            this._error('Could not find the file at: ' + filePath
            + ' | if relative path used then relative to cli process :'
            + process.cwd(),
            404);
            return false;
        }

        this.parserErrorFlag = false;
        this.parserErrors = {};

        let filePathExt = path.extname(filePath);


        if (filePathExt.length < 1) {
            filePath = filePath + this.options.defaultFileExt;
        }
        else if (filePathExt.toLowerCase() != this.options.defaultFileExt.toLowerCase()) {
            // Problem loading the
            this._error("Invalid file extension, expected :" + this.options.defaultFileExt , 405, e);
            return false;
        }

        let contents;

        try {
            let contents = fs.readFileSync(filePath,'utf8');

            // now lets parse the contents
            this.parse(contents)

            return true;

        } catch ( e ) {
            // Problem loading the
            this._error("Problem Loading the slib file into parser", 500, e);
            return false;
        }

    }


    /**
     * parse - Parse contents of a string
     *
     * @param  {type} contents description
     * @return {type}          description
     */
    parse(contents) {
        try {
            this.parsedJson = schemaLibParser.parse(contents);
        } catch ( e ) {
            this._error("Problem Parsing", 501, e);
            return false;
        }
        return true;
    }


    /**
     * getRawData - Returns the raw json object of the parsed file
     *
     * @return Object
     */
    getRawData() {

        return this.parsedJson;

    }


    /**
     * getRawErrors - Returns the object of errors that happened during the parse
     *
     * @return Object description
     */
    getRawErrors() {

        return this.parserErrors;

    }


    /**
     * queryJson - description
     *
     * @param  String query jsonQuery
     * @return Object      result
     */
    queryJson(query) {

        return jsonQuery(query, this.parsedJson);

    }

    getNamespace() {



    }

    /**
     * _error - Issue an error (Internal)
     *
     * @param  string error   Error Message
     * @param  int errorId Unique ID  for message
     * @return void
     */
    _error( errorMsg, errorId, errorData = {}) {
        this.parserErrors[errorId] = {errorMsg: errorMsg, errorData: errorData};
        if (this.options.throwError === true) {
            throw Error(errorMsg);
        }
    }

}


module.exports      = Parser;
