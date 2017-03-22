/*jshint esversion: 6 */

const SchemaLibParser   = require ('../parser/parser');
const Base              = require ('../base');
const Workspace         = require ("../workspace");
const path              = require('path');

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

        this._workspace = null;
    }

    _loadWorkspace( path ) {
        this._workspace = new Workspace();

        this._workspace.loadWorkspaceConfig();
    }

    load( path ) {
        this._loadWorkspace();
        console.log(this._workspace.workspaceDir);


    }

}

module.exports      = {
    Generate: Generate,
    Events: events
};