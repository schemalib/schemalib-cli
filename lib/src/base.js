/*jshint esversion: 6 */

const EventEmitter      = require ('events');
const merge             = require ('merge');
const chalk             = require('chalk');

class Base extends EventEmitter {

    constructor(optionsDefault = {}, options = {}) {
        super();

        this.errorFlag = false;
        this.errors = {};

        if ( typeof options == "object" ) {
            options = merge(optionsDefault, options);
        }

        if (!options.hasOwnProperty('throwError')) {
            options.throwError = false;
        }
        if (!options.hasOwnProperty('displayError')) {
            options.displayError = true;
        }
        if (!options.hasOwnProperty('debug')) {
            options.debug = false;
        }

        this.options = options;

    }

    /**
     * _error - Issue an error (Internal)
     *
     * @param  string error   Error Message
     * @param  int errorId Unique ID  for message
     * @return void
     */

    _error( errorMsg, errorId, errorData = {}) {
        this.errors[errorId] = {errorMsg: errorMsg, errorData: errorData};
        this.errorFlag = true;
        if (this.options.hasOwnProperty('throwError') && this.options.throwError === true) {
            throw Error(errorMsg);
        }
        if (this.options.hasOwnProperty('displayError') && this.options.displayError === true) {
            console.error(chalk.red.bold("[ERROR]:"), errorMsg);
            process.exit(1);
        }
    }

    /**
     * getRawErrors - Returns the object of errors that happened during the parse
     *
     * @return Object description
     */
    getRawErrors() {

        return this.errors;

    }
}

module.exports      = Base;