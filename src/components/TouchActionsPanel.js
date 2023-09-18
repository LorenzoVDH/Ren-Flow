import { Panel, useReactFlow } from "reactflow";
import { useRenFlow } from "./RenFlowContext";

const TouchActionsPanel = ({reactFlowWrapper}) => {
    const { selectedNode, newNodeHandler, deleteNodeHandler, handleGlobalShowCodeChange } = useRenFlow();
    const { fitView } = useReactFlow(); 

    return (
        <Panel style={{ width: '100%', margin: '3px' }} position="bottom-center">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button style={{ fontSize: '35px', margin: '0px 3px' }} onClick={(event) => newNodeHandler(event, reactFlowWrapper, true)}>🆕</button>
                <button style={{ fontSize: '35px', margin: '0px 3px' }} onClick={deleteNodeHandler}>❌</button>
                <button style={{ fontSize: '35px', margin: '0px 3px' }} onClick={handleGlobalShowCodeChange}>🔄</button>
                <button style={{ fontSize: '35px', margin: '0px 3px' }} onClick={fitView}>🏞️</button>
            </div>
        </Panel>

    );
}

export default TouchActionsPanel;