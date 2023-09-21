import Editor from "react-simple-code-editor";
import { useRenFlow } from "./RenFlowContext";
import { highlight } from "prismjs";
import { useState } from "react";

const CodeEditorPanel = ({ code, tabSize, setCode, language, elementFocussedHandler, notEnabled, fontSize }) => {
    //const [showCodeEditorTextArea, setShowCodeEditorTextArea] = useState(true);

    return (
        <>
            {/* <button style={{ width: '95%' }} onClick={() => setShowCodeEditorTextArea(!showCodeEditorTextArea)}>Editor</button>             
            {
                showCodeEditorTextArea ?  */}
                    <div style={{width: 'calc(100% - 15px)',  overflow: 'auto', height: '88%' }}>
                        <Editor
                            value={code}
                            placeholder="nodecode"
                            tabSize={tabSize}
                            padding='5px'
                            onValueChange={(c) => setCode(c)}//code => setCodeInput(code)}
                            highlight={() => highlight(code, language)}
                            onFocus={() => elementFocussedHandler(true)}
                            onBlur={() => elementFocussedHandler(false)}
                            spellCheck='false'
                            disabled={notEnabled}
                            style={{ color: 'white', backgroundColor: 'black', fontFamily: 'Lucida Console', fontSize: String(fontSize)+'px', resize: 'none', minHeight: '100%' }}
                        />
                    </div>
                    {/* : <div style={{ width: '95%' }}></div>
            } */}
            
        </>
    );
}

export default CodeEditorPanel; 