import { Panel } from "reactflow";
import { useRenFlow } from "./RenFlowContext";

const IdeaSketchPad = () => {
    const { ideaSketchPadInput, handleSketchPadChange, handleOnAnyElementFocussed, handleOpenIdeaSketchPad } = useRenFlow();

    return (<Panel position="top-left" style={{ height: '100%', width: '100%', margin: 'auto', backgroundColor: '#EEEEEEEE' }}>
        <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Idea Sketchpad</h1>
        <button style={{ width: '30px', height: '30px', fontSize: '20px', position: 'absolute', right: '10px', top: '10px' }} 
                onClick={() => handleOpenIdeaSketchPad(false)}>x</button>
        <div style={{ width: 'calc(100% - 20px)', margin: '10px', overflow: 'auto', height: '88%' }}>
            <textarea
                id='ideaSketchPad'
                value={ideaSketchPadInput}
                className='nodrag'
                placeholder="Quick sketchpad for ideas"
                onChange={(e) => handleSketchPadChange(e.target.value)}
                onFocus={() => handleOnAnyElementFocussed(true)}
                onBlur={() => handleOnAnyElementFocussed(false)}
                style={{width: 'calc(100% - 10px)', minHeight: 'calc(100% - 10px)', fontSize: '18px', resize: 'none', fontFamily: 'Arial', textAlign: 'left' }}
            />
        </div>
    </Panel>); 
};

export default IdeaSketchPad; 