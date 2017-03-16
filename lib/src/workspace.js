/*jshint esversion: 6 */

const convict           = require ('convict');
const findup            = require ('findup-sync');

let convictSchema = {
            registryUser: {
                doc: "Username ( login ) for the schemalib registry",
                format: "*"
            },
            registryServer: {
                doc: "Url of the registry server, default is: http://registry.schemalib.com",
                format: "url",
                default: "http://registry.schemalib.com"
            },
            defaults: {
                authorName: {
                    doc: "Default author name to use when creating new schemas",
                    format: string
                },
                authorWebsite: {
                    doc: "Default author name to use when creating new schemas",
                    format: "url"
                },
                authorEmail: {
                    doc: "Default author name to use when creating new schemas",
                    format: "email"
                }
            }
        };

class Workspace { 

    constructor(options = {}) {
        super({
            'debug':  false,
            'workspaceFileName': 'workspace.json'
        },
        options);
    }

    loadWorkspaceConfig (cmd = null) {

        let configPath = null;
        if (cmd === null) {
            configPath = findup(this.options.workspaceFileName,{ nocase: true});
        }
        else {
            configPath = findup(this.options.workspaceFileName,{cwd: cmd, nocase: true});
        }

        let conf = convict(convictSchema);

    }

}

module.exports      = Workspace;