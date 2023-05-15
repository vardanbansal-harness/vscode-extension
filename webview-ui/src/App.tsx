import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { WebviewApi } from "vscode-webview";
import { get } from "lodash";

// const value = `version: 1\noptions:\n  repository:\n    disabled: true\nstages:\n  - name: build1\n    desc: sample ci build stage\n    type: ci\n    spec:\n      steps:\n        - name: Run echo 1\n          spec:\n            run: echo \"hi from the demo\"\n          type: script\n        - name: Run echo 2\n          type: plugin\n          spec:\n            uses: docker\n            with:\n              repo: harness/hello-world\n              connector: account.dockerhub\n        - name: new_step\n          type: script\n          spec:\n            run: echo hi\n        - name: one_more_Step\n          type: action\nname: bugbash pipeline\n`
// const updatedValue = `version: 1\noptions:\n  repository:\n    disabled: true\nstages:\n  - name: build1\n    desc: sample ci build stage\n    type: ci\n    spec:\n      steps:\n        - name: Run Step\n          spec:\n            run: echo \"added from panel\"\n          type: script\n        - name: Run echo 1\n          spec:\n            run: echo \"hi from the demo\"\n          type: script\n        - name: Run echo 2\n          type: plugin\n          spec:\n            uses: docker\n            with:\n              repo: harness/hello-world\n              connector: account.dockerhub\n        - name: new_step\n          type: script\n          spec:\n            run: echo hi\n        - name: one_more_Step\n          type: action\nname: bugbash pipeline\n`

function App() {
  const vscodeRef = useRef<WebviewApi<unknown>>()
  const [shouldRenderPluginForm, setShouldRenderPluginForm] = useState<boolean>(false)

  useEffect(() => {
    vscodeRef.current = acquireVsCodeApi();
  }, [])

  function onAddClick(event: any) {
    const script = get(event, 'target.value')
    if(script && vscodeRef.current){
    vscodeRef.current.postMessage({ type: 'addYAML', value: `${script}\n` });
    }
  }

  return (
    <main>
      {shouldRenderPluginForm ? 
      <>
        <VSCodeTextArea style={{width: '100%'}} onChange={onAddClick}/>
        <VSCodeButton onClick={onAddClick} className="addBtn">Add</VSCodeButton>
      </> : 
      <div>
        <VSCodeButton onClick={() => setShouldRenderPluginForm(true)}>Add a plugin</VSCodeButton>
      </div>}
    </main>
  );
}

export default App;
