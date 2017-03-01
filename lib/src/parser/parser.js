const schemaLibParser           = require("../../grammar/schemalib-language");
const fs                        = require("fs");
const pathExists                = require('path-exists');
const merge                     = require('merge');

/**
 * Parser error ids:
 * 404 - Couldn't find the file
 * 500 - Problem Loading the file
 * 501 - Problem Parsing the file
 */

class Parser {

    constructor(options = {}) {
        this.parsedJson = {};
        this.parserErrorFlag = false;
        this.parserErrors = {};

        var optionsDefault = {
            'debug':  false
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


        try {
            let contents = fs.readFileSync(filePath);
        } catch ( e ) {
            // Problem loading the
            this._error("Problem Loading the slib file into parser", 500, e);
            return false;
        }

        try {
            this.parsedJson = schemaLibParser.parse(contents);
        } catch ( e ) {
            this._error("Problem Parsing", 501, e);
            return false;
        }

        return true;

    }



    /**
     * _error - Issue an error (Internal)
     *
     * @param  string error   Error Message
     * @param  int errorId Unique ID  for message
     * @return void
     */
    _error( errorMsg, errorId, errorData = {}) {
        if (this.options.debug === true) {
            console.log(error);
        }
        this.parserErrors[errorId] = {errorMsg: errorMsg, errorData: errorData};
    }

}
