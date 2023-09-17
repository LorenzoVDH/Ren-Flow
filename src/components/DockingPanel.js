import { useEffect, useState } from "react";
import { Panel } from "reactflow";

const DockingPanel = ({ props, side, panelOpen, panelWidth, showFullPanel }) => {
    const [showPanel, setShowPanel] = useState(true); 
    const [fullPanel, setFullPanel] = useState(false);

    useEffect(() => {
        setShowPanel(panelOpen);
    }, [panelOpen]);
    
    let html; 

    if (side === 'right'){
        if (showPanel){
            html = 
            (<Panel position="top-right" style={{ height: '100%', width: fullPanel ? '100%' : panelWidth, margin: '0px', backgroundColor: '#EEEEEECC' }}>
                <button hidden={!showFullPanel} style={{ position: 'absolute', top: '30px', right: '5px', width: '32px' }} onClick={() => {setFullPanel(!fullPanel)}} >{'[]'}</button>
                <button style={{ position: 'absolute', top: '5px', right: '5px', width: '32px' }} onClick={() => setShowPanel(false)} >{'>'}</button>
                {props.panelContentOpen}
            </Panel>)
        } else {
            html = 
            (<Panel position="top-right" style={{ height: '100%', margin: '0px', backgroundColor: 'transparent' }}>
                <button style={{ margin: '5px', width: '32px' }} onClick={() => setShowPanel(true)} >{'<'}</button>
                {props.panelContentClosed}
            </Panel>)
        }
    } else {
        if (showPanel){
            html = 
            (<Panel position="top-left" style={{ height: '100%', width: fullPanel ? '100%' : panelWidth, margin: '0px', backgroundColor: '#EEEEEECC' }}>
                <button hidden={!showFullPanel} style={{ position: 'absolute', top: '30px', right: '5px', width: '32px' }} onClick={() => {setFullPanel(!fullPanel)}} >{'[]'}</button>
                <button style={{ margin: '5px', width: '32px' }} onClick={() => setShowPanel(false)} >{'<'}</button>
                {props.panelContentOpen}
            </Panel>)
        } else {
            html = 
            (<Panel position="top-left" style={{ height: '100%', margin: '0px', backgroundColor: 'transparent' }}>
                <button style={{ margin: '5px', width: '32px' }} onClick={() => setShowPanel(true)} >{'>'}</button>
                {props.panelContentClosed}
            </Panel>)
        }
    }
    
    return html; 
}

export default DockingPanel; 