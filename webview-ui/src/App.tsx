import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { WebviewApi } from "vscode-webview";
import { useCallback, useEffect, useRef, useState } from "react";
import { get } from "lodash";
import "./App.css";

// const value = `version: 1\noptions:\n  repository:\n    disabled: true\nstages:\n  - name: build1\n    desc: sample ci build stage\n    type: ci\n    spec:\n      steps:\n        - name: Run echo 1\n          spec:\n            run: echo \"hi from the demo\"\n          type: script\n        - name: Run echo 2\n          type: plugin\n          spec:\n            uses: docker\n            with:\n              repo: harness/hello-world\n              connector: account.dockerhub\n        - name: new_step\n          type: script\n          spec:\n            run: echo hi\n        - name: one_more_Step\n          type: action\nname: bugbash pipeline\n`
// const updatedValue = `version: 1\noptions:\n  repository:\n    disabled: true\nstages:\n  - name: build1\n    desc: sample ci build stage\n    type: ci\n    spec:\n      steps:\n        - name: Run Step\n          spec:\n            run: echo \"added from panel\"\n          type: script\n        - name: Run echo 1\n          spec:\n            run: echo \"hi from the demo\"\n          type: script\n        - name: Run echo 2\n          type: plugin\n          spec:\n            uses: docker\n            with:\n              repo: harness/hello-world\n              connector: account.dockerhub\n        - name: new_step\n          type: script\n          spec:\n            run: echo hi\n        - name: one_more_Step\n          type: action\nname: bugbash pipeline\n`

function App() {
  const [command, setCommand] = useState<string>('')
  const vscodeRef = useRef<WebviewApi<unknown>>()
  const [shouldRenderPluginForm, setShouldRenderPluginForm] = useState<boolean>(false)

  useEffect(() => {
    vscodeRef.current = acquireVsCodeApi();
  }, [])

  const onAddClick = useCallback(()  => {
    if(command && vscodeRef.current){
      vscodeRef.current.postMessage({ type: 'addYAML', value: `${command}\n` });
    }
  }, [command])

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    switch (message.type) {
      case 'handleAdd': {
        setCommand(message.data)
        break;
      }
    }
  });

  return (
    <main>
      {shouldRenderPluginForm ? 
      <>
        <VSCodeTextArea style={{width: '100%'}} onChange={(event: any) => setCommand(get(event, 'target.value'))} value={command}/>
        <VSCodeButton onClick={onAddClick} className="addBtn">Add</VSCodeButton>
      </> : 
      <div>
        <VSCodeButton onClick={() => setShouldRenderPluginForm(true)}>Add a plugin</VSCodeButton>
      </div>}
    </main>
  );
}

export default App;
