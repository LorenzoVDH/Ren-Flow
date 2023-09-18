import { useEffect } from "react";
import DockingPanel from "./DockingPanel";
import CodeEditorPanel from "./CodeEditorPanel";
import { useRenFlow } from "./RenFlowContext";
import { useReactFlow } from "reactflow";

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
        fileList
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
                <table style={{ textAlign: 'left'}}>
                    <tbody>
                        <tr>
                            <th style={{width: '15%'}}>File</th>
                            <td style={{width: '50%'}}>{globalFileName}</td>
                        </tr>
                        <tr>
                            <th style={{width: '15%'}}>Outputs</th>
                            <td style={{width: '50%'}}>
                                <input  style={{width: '35px', backgroundColor: 'transparent', border: 'none'}}
                                        type='number' 
                                        value={globalOutputNumber} 
                                        onChange={e => handleOutputChange(e)} 
                                        onFocus={() => handleOnAnyElementFocussed(true)}
                                        onBlur={() => handleOnAnyElementFocussed(false)}
                                        min='1' 
                                        max='9'/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <CodeEditorPanel
                    code={globalCode}
                    tabSize={tabSize}
                    setCode={handleGlobalCodeChange}
                    language={globalCodeLanguage}
                    elementFocussedHandler={handleOnAnyElementFocussed}
                    notEnabled={selectedNode === undefined} />
                    </>
                : <></>
            }
        </div>
    );

    return (
    <DockingPanel props={{ panelContentOpen }} side='right' panelOpen={rightDockingPanelOpen} panelWidth='40%' showFullPanel={true} controlButtonsSize='30px'/>
    );
}

export default RightDockingPanel; 