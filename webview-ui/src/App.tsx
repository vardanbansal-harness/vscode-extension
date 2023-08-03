import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { WebviewApi } from "vscode-webview";
import { useCallback, useEffect, useRef, useState } from "react";
import { get } from "lodash";
import "./App.css";
import { StepCategories, StepCategory } from "./Constants";

const enum PanelView{
  Category = 'Category',
  Configuration = 'Configuration'
}

function App() {
  const [input, setInput] = useState<string>('')
  const vscodeRef = useRef<WebviewApi<unknown>>()
  const [panelView, setPanelView] = useState<PanelView>(PanelView.Category)

  useEffect(() => {
    vscodeRef.current = acquireVsCodeApi();
  }, [])

  const onAddClick = useCallback(()  => {
    if(input && vscodeRef.current){
      vscodeRef.current.postMessage({ type: 'addYAML', value: input });
    }
  }, [input])

  // Handle messages sent from the extension to the webview
  window.addEventListener('message', event => {
    const message = event.data; // The json data that the extension sent
    const {type, data: stepData} = message
    switch (type) {
      case 'handleAdd': {
        setInput(stepData)
        break;
      }
    }
  });

  const renderPluginCategory = useCallback((category: StepCategory) : JSX.Element => {
    const {label, description, value} = category
    return <div key={value} className="category" onClick={() => {
      setPanelView(PanelView.Configuration)
    }}>
        <div className="label">{label}</div>
        <div className="description">{description}</div>
      </div>
  }, [])

  const renderPluginConfigurationForm = useCallback(() : JSX.Element => {
    return <div className="configForm">
      <VSCodeTextArea style={{width: '50%'}} onChange={(event: any) => setInput(get(event, 'target.value'))} value={input} className="textArea"/>
      <VSCodeButton onClick={onAddClick} className="addBtn">Add</VSCodeButton>
    </div>
  }, [input])

  return (
    <main>
        <div className="plugins">Plugins</div>
        {panelView === PanelView.Category ? 
        <div className="categories">
          {StepCategories.map((category: StepCategory) => renderPluginCategory(category))}
        </div> : renderPluginConfigurationForm()}
    </main>
  );
}

export default App;
