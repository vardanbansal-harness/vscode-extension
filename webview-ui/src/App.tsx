import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import MonacoEditor from 'react-monaco-editor';
import "./App.css";

function App() {
  function interact() {
    vscode.postMessage({
      command: "sendMessage",
      text: "Message sent by React App!",
    });
  }

  const value = `version: 1\noptions:\n  repository:\n    disabled: true\nstages:\n  - name: build1\n    desc: sample ci build stage\n    type: ci\n    spec:\n      steps:\n        - name: Run echo 1\n          spec:\n            run: echo \"hi from the demo\"\n          type: script\n        - name: Run echo 2\n          type: plugin\n          spec:\n            uses: docker\n            with:\n              repo: harness/hello-world\n              connector: account.dockerhub\n        - name: new_step\n          type: script\n          spec:\n            run: echo hi\n        - name: one_more_Step\n          type: action\nname: bugbash pipeline - Clone\n`

  return (
    <main>
      <h1>This text is coming from a React application</h1>
      <VSCodeButton onClick={interact}>Interact with VS Code</VSCodeButton>
      <div className="editor">
      <MonacoEditor 
        width="800"
        height="600"
        language="yaml"
        value={value}
        theme="vs"
        />
        </div>
    </main>
  );
}

export default App;
