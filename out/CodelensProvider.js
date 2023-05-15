"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodelensProvider = void 0;
const vscode = require("vscode");
/**
 * CodelensProvider
 */
var Entity;
(function (Entity) {
    Entity["Inputs"] = "Inputs";
    Entity["Stages"] = "Stages";
    Entity["Steps"] = "Steps";
})(Entity || (Entity = {}));
class CodelensProvider {
    constructor() {
        this.codeLenses = [];
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
        this.entityMetaDataList = [{ entityType: Entity.Steps, regexp: /steps:/g }, { entityType: Entity.Inputs, regexp: /inputs:/g }, { entityType: Entity.Stages, regexp: /stages:/g }];
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }
    provideCodeLenses(document, token) {
        if (vscode.workspace.getConfiguration("codelens-sample").get("enableCodeLens", true)) {
            this.codeLenses = [];
            for (let itr = 0; itr < this.entityMetaDataList.length; itr++) {
                const { entityType, regexp } = this.entityMetaDataList[itr];
                const regex = new RegExp(regexp);
                const text = document.getText();
                let matches;
                while ((matches = regex.exec(text)) !== null) {
                    const line = document.lineAt(document.positionAt(matches.index).line);
                    const indexOf = line.text.indexOf(matches[0]);
                    const position = new vscode.Position(line.lineNumber, indexOf);
                    const range = document.getWordRangeAtPosition(position, new RegExp(regex));
                    if (range) {
                        this.codeLenses.push(new vscode.CodeLens(range, {
                            title: "Add",
                            tooltip: `Add to ${entityType}`,
                            command: "codelens-sample.codelensAction",
                            arguments: [entityType, false]
                        }));
                    }
                }
            }
            return this.codeLenses;
        }
        return [];
    }
}
exports.CodelensProvider = CodelensProvider;
//# sourceMappingURL=CodelensProvider.js.map