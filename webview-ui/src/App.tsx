import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";

function App() {
  function interact() {
    vscode.postMessage({
      command: "sendMessage",
      text: "Message sent by React App!",
    });
  }

  return (
    <main>
      <h1>This text is coming from a React application</h1>
      <VSCodeButton onClick={interact}>Interact with VS Code</VSCodeButton>
    </main>
  );
}

export default App;
