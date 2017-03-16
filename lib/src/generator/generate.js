/*jshint esversion: 6 */

const SchemaLibParser   = require ('../parser/parser');
const Base              = require ('../base');

let events = {
    "app":"app",
    "service":"service",
    "type":"type",
    "enum":"enum"
};

class Generate extends Base {

    constructor(options = {}) {
        super({
            'debug':  false
        },
        options);
    }

    load( filePath ) {


    }

}

module.exports      = {
    Generate: Generate,
    Events: events
};