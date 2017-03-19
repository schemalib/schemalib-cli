/*jshint esversion: 6 */

const convict           = require ('convict');
const findup            = require ('findup-sync');
const Base              = require('./base');
const fs                = require('fs');
const path              = require('path');

let convictSchema = {
            username: {
                doc: "Username ( login ) for the schemalib registry",
                format: "*",
                default: undefined
            },
            registry: {
                doc: "Url of the registry server, default is: http://registry.schemalib.com",
                format: "url",
                default: "http://registry.schemalib.com"
            },
            authorName: {
                doc: "Default author name to use when creating new schemas",
                format: String,
                default: undefined
            },
            authorWebsite: {
                doc: "Default author name to use when creating new schemas",
                format: "url",
                default: undefined
            },
            authorEmail: {
                doc: "Default author name to use when creating new schemas",
                format: "email",
                default: undefined
            }
        };

class Workspace extends Base { 

    constructor(cmd = null, options = {}) {
        super({
            'debug':  false,
            'workspaceFileName': 'workspace.json'
        },
        options);

        this.config = convict(convictSchema);
    }

    loadWorkspaceConfig (cmd = null) {

        let configPath = null;
        if (cmd === null) {
            configPath = findup(this.options.workspaceFileName,{ nocase: true});
        }
        else {
            configPath = findup(this.options.workspaceFileName,{cwd: cmd, nocase: true});
        }

        this.config.loadFile(configPath);
    }

    createWorkspaceConfig (cmd = null, config = {}) {

        let pathFile = this.options.workspaceFileName;

        if (cmd === null) {
            pathFile = pathFile;
        }
        else {
            pathFile = cmd + path.sep + pathFile;
        }


        this.config.load(config);

        try {
            fs.writeFileSync(pathFile, this.config.toString());
        } catch (err) {
            this._error("Problem writing " + pathFile + " : " + err.message);
        }

    }

    getWorkspaceConfig () {
        return this.config.toString();
    }

}

module.exports      = Workspace;