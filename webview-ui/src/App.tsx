import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useState } from "react";
import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";

// const value = `version: 1\noptions:\n  repository:\n    disabled: true\nstages:\n  - name: build1\n    desc: sample ci build stage\n    type: ci\n    spec:\n      steps:\n        - name: Run echo 1\n          spec:\n            run: echo \"hi from the demo\"\n          type: script\n        - name: Run echo 2\n          type: plugin\n          spec:\n            uses: docker\n            with:\n              repo: harness/hello-world\n              connector: account.dockerhub\n        - name: new_step\n          type: script\n          spec:\n            run: echo hi\n        - name: one_more_Step\n          type: action\nname: bugbash pipeline\n`
// const updatedValue = `version: 1\noptions:\n  repository:\n    disabled: true\nstages:\n  - name: build1\n    desc: sample ci build stage\n    type: ci\n    spec:\n      steps:\n        - name: Run Step\n          spec:\n            run: echo \"added from panel\"\n          type: script\n        - name: Run echo 1\n          spec:\n            run: echo \"hi from the demo\"\n          type: script\n        - name: Run echo 2\n          type: plugin\n          spec:\n            uses: docker\n            with:\n              repo: harness/hello-world\n              connector: account.dockerhub\n        - name: new_step\n          type: script\n          spec:\n            run: echo hi\n        - name: one_more_Step\n          type: action\nname: bugbash pipeline\n`

function App() {

  const [shouldRenderPluginForm, setShouldRenderPluginForm] = useState<boolean>(false)

  return (
    <main>
      {shouldRenderPluginForm ? 
      <>
        <VSCodeTextArea style={{width: '100%'}}/>
        <VSCodeButton onClick={() => {}} className="addBtn">Add</VSCodeButton>
      </> : 
      <div>
        <VSCodeButton onClick={() => setShouldRenderPluginForm(true)}>Add a plugin</VSCodeButton>
      </div>}
    </main>
  );
}

export default App;
