import { useEffect } from "react";
import DockingPanel from "./DockingPanel";
import CodeEditorPanel from "./CodeEditorPanel";
import { useRenFlow } from "./RenFlowContext";
import { useReactFlow } from "reactflow";
import AddMenuPrompt from "./AddMenuPrompt";

const RightDockingPanel = ({ }) => {
    const { globalCode, handleGlobalCodeChange,
        tabSize, globalCodeLanguage,
        handleOnAnyElementFocussed,
        selectedNode,
        rightDockingPanelOpen, 
        globalOutputNumber,
        handleGlobalOutputNumber,
        handleGlobalFileNameChange,
        globalFileName,
        fileList,
        codeEditorFontSize,
        handleCodeEditorFontSizeChange
     } = useRenFlow();

    const { getNodes, setNodes } = useReactFlow(); 

    useEffect(() => {
        handleGlobalCodeChange(selectedNode?.data.codeInput || '');
        handleGlobalOutputNumber(selectedNode?.data.outputNumber || 0); 
        handleGlobalFileNameChange(fileList.find(f => f.id === selectedNode?.data.fileId)?.name || '');
    }, [selectedNode]); 

    const handleOutputChange = (e) => {
        let newValue = parseInt(e.target.value, 10); 
        if (newValue > 9){
            return;
        }
        handleGlobalOutputNumber(newValue); 
    };

    useEffect(() => {
        if (selectedNode) {
            const updatedNodes = getNodes().map((node) => {
                if (node.id === selectedNode.id) {
                    // Update the selectedNode's data
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            outputNumber: globalOutputNumber
                        },
                    };
                }
                return node;
            });

            // Update the nodes using setNodes
            setNodes(updatedNodes);
        }
    }, [globalOutputNumber]);

    const panelContentOpen = (        
        <div style={{ margin: '15px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            {
                selectedNode ? 
                <>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <table style={{ textAlign: 'left', maxWidth: '130px', marginRight: '30px' }}>
                            <tbody>
                                <tr>
                                    <th >File</th>
                                    <td >{globalFileName}</td>
                                </tr>
                                <tr>
                                    <th >Outputs</th>
                                    <td >
                                        <input  style={{width: '35px'}}
                                                type='number' 
                                                value={globalOutputNumber} 
                                                onChange={e => handleOutputChange(e)} 
                                                onFocus={() => handleOnAnyElementFocussed(true)}
                                                onBlur={() => handleOnAnyElementFocussed(false)}
                                                min='1' 
                                                max='9'/>
                                    </td>
                                </tr>
                                <tr>
                                    <th >Font Size</th>
                                    <td ><input type='number'
                                                min='7'
                                                max='99'
                                                value={codeEditorFontSize}
                                                onChange={(e) => handleCodeEditorFontSizeChange(e.target.value)}
                                                onFocus={() => handleOnAnyElementFocussed(true)}
                                                onBlur={() => handleOnAnyElementFocussed(false)}
                                                style={{width: '35px'}} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <AddMenuPrompt/>
                    </div>
                    <CodeEditorPanel
                        code={globalCode}
                        tabSize={tabSize}
                        setCode={handleGlobalCodeChange}
                        language={globalCodeLanguage}
                        elementFocussedHandler={handleOnAnyElementFocussed}
                        notEnabled={selectedNode === undefined}
                        fontSize={codeEditorFontSize} />
                    </>
                : <></>
                
            }
        </div>
    );

    return (
        <DockingPanel   props={{ panelContentOpen }} 
                        side='right' 
                        panelOpen={rightDockingPanelOpen} 
                        panelWidth='40%' 
                        showFullPanel={true} 
                        controlButtonsSize='30px' />
    );
}

export default RightDockingPanel; 