import { Panel, useReactFlow } from "reactflow";
import { useRenFlow } from "./RenFlowContext";

const TouchActionsPanel = ({reactFlowWrapper}) => {
    const { selectedNode, newNodeHandler, deleteNodeHandler, handleGlobalShowCodeChange, handleOpenIdeaSketchPad } = useRenFlow();
    const { fitView } = useReactFlow(); 

    return (
        <Panel style={{ width: '100%', margin: '15px 0px' }} position="top-center">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button style={{ fontSize: '30px', margin: '0px 1px' }} onClick={(event) => newNodeHandler(event, reactFlowWrapper, true)}>🆕</button>
                <button style={{ fontSize: '30px', margin: '0px 1px' }} onClick={deleteNodeHandler}>❌</button>
                <button style={{ fontSize: '30px', margin: '0px 1px' }} onClick={handleGlobalShowCodeChange}>🔄</button>
                <button style={{ fontSize: '30px', margin: '0px 1px' }} onClick={fitView}>🏞️</button>
                <button style={{ fontSize: '30px', margin: '0px 1px' }} onClick={() => handleOpenIdeaSketchPad(true)}>🗒️</button>
            </div>
        </Panel>

    );
}

export default TouchActionsPanel;