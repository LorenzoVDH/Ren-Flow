import { useEffect, useState } from "react";
import { Panel } from "reactflow";

const DockingPanel = ({ props, side, panelOpen, panelWidth, showFullPanel, controlButtonsSize}) => {
    const [showPanel, setShowPanel] = useState(true); 
    const [fullPanel, setFullPanel] = useState(true);

    useEffect(() => {
        setShowPanel(panelOpen);
    }, [panelOpen]);
    
    let html; 

    if (side === 'right'){
        if (showPanel){
            html = 
            (<Panel position="top-right" style={{ height: '100%', width: fullPanel ? '100%' : panelWidth, margin: '5px', backgroundColor: '#EEEEEECC' }}>
                <div style={{ position: 'absolute', right: '0px' }}>
                    <button style={{fontSize: controlButtonsSize}} hidden={!showFullPanel} onClick={() => {setFullPanel(!fullPanel)}} >{'[]'}</button>
                    <button style={{fontSize: controlButtonsSize}} onClick={() => setShowPanel(false)} >{'>'}</button>
                </div>
                {props.panelContentOpen}
            </Panel>)
        } else {
            html = 
            (<Panel position="top-right" style={{ height: '100%', margin: '0px', backgroundColor: 'transparent' }}>
                <button style={{ margin: '5px', fontSize: controlButtonsSize }} onClick={() => setShowPanel(true)} >{'<'}</button>
                {props.panelContentClosed}
            </Panel>)
        }
    } else {
        if (showPanel){
            html = 
            (<Panel position="top-left" style={{ height: '100%', width: fullPanel ? '100%' : panelWidth, margin: '0px', backgroundColor: '#EEEEEECC' }}>
                <button style={{ margin: '5px', fontSize: controlButtonsSize }} onClick={() => setShowPanel(false)} >{'<'}</button>
                <button hidden={!showFullPanel} style={{ fontSize: controlButtonsSize, position: 'absolute', top: '30px', right: '5px' }} onClick={() => {setFullPanel(!fullPanel)}} >{'[]'}</button>
                {props.panelContentOpen}
            </Panel>)
        } else {
            html = 
            (<Panel position="top-left" style={{ height: '100%', margin: '0px', backgroundColor: 'transparent' }}>
                <button style={{ margin: '5px', fontSize: controlButtonsSize }} onClick={() => setShowPanel(true)} >{'>'}</button>
                {props.panelContentClosed}
            </Panel>)
        }
    }
    
    return html; 
}

export default DockingPanel; 