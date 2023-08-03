"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const vscode_1 = require("vscode");
const CodelensProvider_1 = require("./CodelensProvider");
const getUri_1 = require("./utilities/getUri");
const YAMLHelper_1 = require("./utilities/YAMLHelper");
const lodash_1 = require("lodash");
let disposables = [];
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    /* Bootstrap Pipeline Config left side panel */
    const provider = new PipelineConfigViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(PipelineConfigViewProvider.viewType, provider));
    /* Bootstrap Codelens provider on main editor window */
    const codelensProvider = new CodelensProvider_1.CodelensProvider();
    vscode_1.languages.registerCodeLensProvider("*", codelensProvider);
    vscode_1.commands.registerCommand("codelens-sample.enableCodeLens", () => {
        vscode_1.workspace.getConfiguration("codelens-sample").update("enableCodeLens", true, true);
    });
    vscode_1.commands.registerCommand("codelens-sample.disableCodeLens", () => {
        vscode_1.workspace.getConfiguration("codelens-sample").update("enableCodeLens", false, true);
    });
    vscode_1.commands.registerCommand("codelens-sample.codelensAction", (args) => {
        vscode_1.window.showInformationMessage(`This action adds an item to "${args}"`);
        provider.handleClick(args);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    if (disposables) {
        disposables.forEach(item => item.dispose());
    }
    disposables = [];
}
exports.deactivate = deactivate;
class PipelineConfigViewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    handleClick(args) {
        var _a, _b;
        if (this._view) {
            (_b = (_a = this._view).show) === null || _b === void 0 ? void 0 : _b.call(_a, true); // `show` is not implemented in 1.49 but is for 1.50 insiders
            this._view.webview.postMessage({ type: 'handleAdd', data: `command from extension for ${args}` });
        }
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._extensionUri);
        // on click handler for buttons in webview (React app)
        webviewView.webview.onDidReceiveMessage(data => {
            var _a, _b, _c;
            const { type, value } = data;
            if (!(0, lodash_1.isEmpty)(value)) {
                switch (type) {
                    case 'addYAML':
                        const editor = vscode.window.activeTextEditor;
                        const existingYAML = ((_c = (_b = (_a = vscode.window) === null || _a === void 0 ? void 0 : _a.activeTextEditor) === null || _b === void 0 ? void 0 : _b.document) === null || _c === void 0 ? void 0 : _c.getText()) || '';
                        const existingPipelineObj = (0, YAMLHelper_1.yamlParse)(existingYAML);
                        const stepToInsert = { name: "Script", spec: { run: value }, type: "script" };
                        const existingSteps = (0, lodash_1.get)(existingPipelineObj, 'stages.0.spec.steps', []);
                        existingSteps.push(stepToInsert);
                        const updatedPipelineObj = (0, lodash_1.set)(existingPipelineObj, 'stages.0.spec.steps', existingSteps);
                        const updatePipelineYAML = (0, YAMLHelper_1.yamlStringify)(updatedPipelineObj);
                        editor === null || editor === void 0 ? void 0 : editor.edit(builder => {
                            const doc = editor === null || editor === void 0 ? void 0 : editor.document;
                            builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), updatePipelineYAML);
                        });
                        break;
                }
            }
        });
    }
    _getWebviewContent(webview, extensionUri) {
        // The CSS file from the React build output
        const stylesUri = (0, getUri_1.getUri)(webview, extensionUri, [
            "webview-ui",
            "build",
            "static",
            "css",
            "main.css",
        ]);
        // The JS file from the React build output
        const scriptUri = (0, getUri_1.getUri)(webview, extensionUri, [
            "webview-ui",
            "build",
            "static",
            "js",
            "main.js",
        ]);
        const nonce = getNonce();
        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Hello World</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }
}
PipelineConfigViewProvider.viewType = 'configPanel.configurePipeline';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map