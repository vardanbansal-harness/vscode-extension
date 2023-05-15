import * as vscode from 'vscode';

/**
 * CodelensProvider
 */

enum Entity{
Inputs = 'Inputs',
Stages = 'Stages',
Steps = 'Steps'
}
export class CodelensProvider implements vscode.CodeLensProvider {

	private codeLenses: vscode.CodeLens[] = [];
	private entityMetaDataList: {regexp: RegExp, entityType: Entity}[];
	private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

	constructor() {
		this.entityMetaDataList = [{entityType: Entity.Steps,regexp: /steps:/g}, {entityType: Entity.Inputs, regexp: /inputs:/g}, {entityType: Entity.Stages, regexp: /stages:/g}];

		vscode.workspace.onDidChangeConfiguration((_) => {
			this._onDidChangeCodeLenses.fire();
		});
	}

	public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {

		if (vscode.workspace.getConfiguration("codelens-sample").get("enableCodeLens", true)) {
			this.codeLenses = [];
			for(let itr = 0; itr < this.entityMetaDataList.length; itr++){
			const {entityType, regexp} = this.entityMetaDataList[itr];
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
			}}
			return this.codeLenses;
		}
		return [];
	}
}

