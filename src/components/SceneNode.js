import React, { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { useUpdateNodeInternals } from 'reactflow';
import Editor from 'react-simple-code-editor';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-renpy';
import 'prismjs/themes/prism.css'; 
import './SceneNode.css'; 
import { useRenFlow } from './RenFlowContext';

export default memo(({ id, data, selected, isConnectable }) => {
    const [codeInput, setCodeInput] = useState(data.codeInput);
    const [descriptionInput, setDescriptionInput] = useState(data.descriptionInput || '');
    const [tags, setTags] = useState(data.tags || []);
    const [showCode, setShowCode] = useState(data.showCode);
    const [editMode, setEditMode] = useState(data.editMode);
    const updateNodeInternals = useUpdateNodeInternals();
    const [numberOfOutputs, setNumberOfOutputs] = useState(1);

    const { handleGlobalCodeChange,
            handleOnAnyElementFocussed,
            handleGlobalOutputNumber } = useRenFlow(); 

    const handleChangeNumberOfOutputs = (event) => {
        const newValue = Number(event.target.value);
        if (newValue > 9){
            return;
        }
        setNumberOfOutputs(newValue);
        data.outputNumber = newValue;
    };

    useEffect(() => {
        if (data.outputNumber !== numberOfOutputs){
            setNumberOfOutputs(data.outputNumber); 
        }
        handleGlobalOutputNumber(data.outputNumber);
    }, [data.outputNumber, setNumberOfOutputs, numberOfOutputs]);

    useEffect(() => {
        setCodeInput(data.codeInput);
    }, [data.codeInput]);

    useEffect(() => {
        data.codeInput = codeInput;
        data.descriptionInput = descriptionInput;
        data.tags = tags;
        updateNodeInternals(id);
    }, [codeInput, descriptionInput, tags, selected]);
    
    const handleCodeChange = (code) => {
        setCodeInput(code);
        handleGlobalCodeChange(code);
    };

    useEffect(() => {
        setShowCode(data.showCode);
        setEditMode(data.showCode);
    }, [data.showCode]);
    
    useEffect(() => {
        if (!selected && !showCode) {
            setEditMode(false);
            handleOnAnyElementFocussed(false);
        }
    }, [selected]);

    useEffect(() => {
        data.editMode = editMode; 
    }, [editMode]); 

    const handleKeyDown = (e) => {
        if (e.key == 'Tab') {
            e.preventDefault();
        }
    };

    return (
        <>
            <NodeResizer color="blue" isVisible={selected} minWidth={100} minHeight={30} maxWidth={600} maxHeight={1000} />
            <Handle
                key={id+"_input"}
                id={id+"_input"}
                title={"node "+id+" input"}
                type="target"
                position={Position.Top}
                //onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={true}
                style={{ opacity: (selected ? 1 : 0) }}
            />
            
            {tags.map((tag) => (
                <div key={tag}>{tag}</div>
            ))}
            {/* <label>{id}</label> */}
            <div style={{ width: '100%', height: 'calc(100% - 5px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                onDoubleClick={() => setEditMode(true)}>
                <div style={{ margin: editMode ? '5px' : '0px' }}>
                    <div style={{ position: 'absolute', top: '0px', left: '5px' }}>
                        {showCode ? 
                        <>
                        <input
                            style={{ border: 'none', backgroundColor: 'transparent', fontFamily: 'Arial', letterSpacing: '-0.3px', fontSize: '9px', width: '30px', /*direction: 'rtl'*/ }}
                            className="nopan nodrag"
                            type="number"
                            value={numberOfOutputs}
                            onFocus={() => {handleOnAnyElementFocussed(true)}}
                            onChange={handleChangeNumberOfOutputs}
                            min='1'
                            max='9'
                            title="Number of outputs"
                            disabled={!selected}
                        /></> : <></>
                        // <label className='smallFont' style={{ color: data.textColor }}>{labelTag}</label>
                        }
                    </div>
                    {/* {editMode ? 
                        <button style={{ fontSize: '7px', color: 'grey', width: '30px', height: '9px', border: 'none', position: 'absolute', top: '1px', right: '5px' }} onClick={() => setShowCode(!showCode)}>
                            {showCode ? 'Text' : 'Code'}
                        </button> 
                            :
                        <></>} */}
                </div>
                {editMode ?
                    (<>
                        <textarea
                            id='descriptionText'
                            value={descriptionInput}
                            className='scriptContent nodrag'
                            placeholder="Description"
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, document.getElementById('descriptionText'))}
                            onFocus={() => handleOnAnyElementFocussed(true)}
                            onBlur={() => handleOnAnyElementFocussed(false)}
                            style={{ flex: 1, width: 'calc(100% - 10px)', fontSize: '12px', resize: 'none', fontFamily: 'Arial', textAlign: 'center' }}
                            hidden={showCode}
                            disabled={!selected}
                        />
                        {(showCode ?
                            <div style={{ flex: 3, width: 'calc(100% - 5px)', resize: 'none', height: '100%', overflow: 'auto' }}>
                                <Editor
                                    value={codeInput}
                                    placeholder="code"
                                    tabSize='4'
                                    padding='5px'
                                    onValueChange={code => handleCodeChange(code)}
                                    highlight={() => highlight(codeInput, languages.renpy)}
                                    className='nodrag my-code-editor'
                                    onFocus={(e) => handleOnAnyElementFocussed(true)}
                                    onBlur={() => handleOnAnyElementFocussed(false)}
                                    spellCheck='false'
                                    style={{ color: 'white', backgroundColor: 'black', fontFamily: 'Lucida Console', fontSize: '11px', resize: 'none', minHeight: '100%' }}
                                    disabled={!selected}
                                />
                            </div> : <></>)}
                    </>) :
                    <div hidden={editMode} style={{ width: 'calc(100% - 30px)', textAlign: 'center', fontSize: '16px', fontFamily: 'Arial', letterSpacing: '-0.38px' }}>
                        {descriptionInput.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                }
                {/* <span style={{color:'gray', fontSize:'5px', marginLeft: '5px'}}>Node #{id}</span> */}
            </div>

            {Array.from({ length: numberOfOutputs }, (_, i) => (
                <Handle
                    key={`${id}_output_${(i+1)}`}
                    id={`${id}_output_${(i+1)}`}
                    type="source"
                    position={Position.Bottom}
                    style={{
                        opacity: selected ? 1 : 0,
                        left: `${(1 + i) / (1 + numberOfOutputs) * 100}%`,
                    }}
                    isConnectable={true}
                    title={"output "+(i+1)}
                />
            ))}
        </>
    )
});