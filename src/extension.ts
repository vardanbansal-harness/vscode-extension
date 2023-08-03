// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExtensionContext, languages, commands, Disposable, workspace, window, Uri } from 'vscode';
import { CodelensProvider } from './CodelensProvider';
import { getUri } from "./utilities/getUri";
import { yamlParse, yamlStringify } from './utilities/YAMLHelper';
import { get, isEmpty, set } from 'lodash';

let disposables: Disposable[] = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  /* Bootstrap Pipeline Config left side panel */
  const provider = new PipelineConfigViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PipelineConfigViewProvider.viewType, provider));

  /* Bootstrap Codelens provider on main editor window */
	const codelensProvider = new CodelensProvider();

	languages.registerCodeLensProvider("*", codelensProvider);

	commands.registerCommand("codelens-sample.enableCodeLens", () => {
		workspace.getConfiguration("codelens-sample").update("enableCodeLens", true, true);
	});

	commands.registerCommand("codelens-sample.disableCodeLens", () => {
		workspace.getConfiguration("codelens-sample").update("enableCodeLens", false, true);
	});

	commands.registerCommand("codelens-sample.codelensAction", (args: any) => {
		window.showInformationMessage(`This action adds an item to "${args}"`);
    provider.handleClick(args);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (disposables) {
		disposables.forEach(item => item.dispose());
	}
	disposables = [];
}

class PipelineConfigViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'configPanel.configurePipeline';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

  public handleClick(args: any) {
		if (this._view) {
			this._view.show?.(true); // `show` is not implemented in 1.49 but is for 1.50 insiders
			this._view.webview.postMessage({ type: 'handleAdd', data: `command from extension for ${args}` });
		}
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
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
			const {type, value} = data
			if(!isEmpty(value)){
			switch (type) {
				case 'addYAML':
					const editor = vscode.window.activeTextEditor
					const existingYAML = vscode.window?.activeTextEditor?.document?.getText() || ''
					const existingPipelineObj = yamlParse(existingYAML) as Record<string, any>
					const stepToInsert = {name: "Script", spec: {run: value}, type: "script"}
					const existingSteps = get(existingPipelineObj, 'stages.0.spec.steps', [])
					existingSteps.push(stepToInsert)
					const updatedPipelineObj = set(existingPipelineObj, 'stages.0.spec.steps', existingSteps)
					const updatePipelineYAML = yamlStringify(updatedPipelineObj)        
					editor?.edit(builder => {
						const doc = editor?.document;
						builder.replace(new vscode.Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end), updatePipelineYAML);
					});
          		break;
				}
			}
		});
	}

	private _getWebviewContent(webview: vscode.Webview, extensionUri: Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "static",
      "css",
      "main.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
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

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
