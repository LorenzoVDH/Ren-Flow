import React, { createContext, useContext, useEffect, useState } from 'react';
import randomLightColour from '../helpers/RandomLightColour';
import { useReactFlow, useOnSelectionChange } from 'reactflow';
import { highlight, languages } from 'prismjs/components/prism-core';

const RenFlowContext = createContext();

export function RenFlowProvider({ children }) {
    const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();
    const initialColors = [randomLightColour(), randomLightColour()];
    const [projectTitle, setProjectTitle] = useState('untitled');
    const [anyElementFocussed, setAnyElementFocussed] = useState(false);
    const [tabbableElementFocussed, setTabbableElementFocussed] = useState(false);
    const [fileList, setFileList] = useState([
        {
            id: 1,
            name: "init",
            color: initialColors[0],
            showColorPicker: false
        }
    ]);
    const [textDarkenedShadePercentage, setTextDarkenedShadePercentage] = useState(10);
    const [lastAppliedFile, setLastAppliedFile] = useState(1);
    const [fileSelectorIdCount, setFileSelectorIdCount] = useState(fileList.length + 1);
    const [nodeIdCount, setNodeIdCount] = useState(1);
    const [rfInstance, setRfInstance] = useState(null); 
    const [globalCode, setGlobalCode] = useState('');
    const [selectedNode, setSelectedNode] = useState(undefined);
    const [leftDockingPanelOpen, setLeftDockingPanelOpen] = useState(true); 
    const [rightDockingPanelOpen, setRightDockingPanelOpen] = useState(true); 
    const [globalOutputNumber, setGlobalOutputNumber] = useState(0);
    const [globalFileName, setGlobalFileName] = useState(""); 
    
    const handleGlobalCodeChange = (newCode) => {
        if (selectedNode) {
            const updatedNodes = getNodes().map((node) => {
                if (node.id === selectedNode.id) {
                    // Update the selectedNode's data
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            codeInput: newCode,
                        },
                    };
                }
                return node;
            });

            // Update the nodes using setNodes
            setNodes(updatedNodes);

            // Optionally, set the global code as well
            setGlobalCode(newCode);
        } else {
            setGlobalCode('');
        }
    };

    const handleGlobalOutputNumber = (outputNumber) => {
        setGlobalOutputNumber(outputNumber);
    }
    
    const handleGlobalFileNameChange = (newFileName) => {
        setGlobalFileName(newFileName); 
    }

    const handleProjectTitleChange = (newTitle) => {
        setProjectTitle(newTitle);
    }

    const handleOnAnyElementFocussed = (focussed) => {
        setAnyElementFocussed(focussed);
    }

    const handleOnTabbableElementFocussed = (focussed) => {
        setTabbableElementFocussed(focussed);
    }

    const handleFileListChange = (newFileList) => {
        setFileList(newFileList);
    }

    const handleLastAppliedFileChange = (newLastAppliedFile) => {
        setLastAppliedFile(newLastAppliedFile); 
    }

    const getNewNodeId = () => {
        const newNodeId = nodeIdCount + 1;
        setNodeIdCount(newNodeId);
        return newNodeId; 
    }

    const getNewFileSelectorId = () => {
        console.log(fileSelectorIdCount); 
        setFileSelectorIdCount(fileSelectorIdCount + 1);
        return fileSelectorIdCount;
    }

    const handleRfInstanceChange = (instance) => {
        setRfInstance(instance);
    }

    const handleEdgeDeletion = (sourceHandleToRemove) => {
        const theEdges = getEdges();
        const filteredEdges = theEdges.filter((e) => e.sourceHandle?.toString() !== sourceHandleToRemove?.toString());
        setEdges(filteredEdges);
    }

    useOnSelectionChange({
        onChange: ({nodes}) => {
            const selectedNodes = nodes;
            
            if (selectedNodes.length === 1 && selectedNodes[0]?.type === 'sceneNode') {
                setSelectedNode(selectedNodes[0]);
            } else {
                setTabbableElementFocussed(false); 
                setAnyElementFocussed(false); 
                setSelectedNode(undefined);
            }
        }
    });

    const tab = '    ';
    const tabSize = tab.length;

    const globalCodeLanguage = languages.renpy;

    const providerValues = {
        projectTitle,
        handleProjectTitleChange,
        anyElementFocussed,
        handleOnAnyElementFocussed,
        tabbableElementFocussed,
        handleOnTabbableElementFocussed,
        fileList,
        handleFileListChange,
        textDarkenedShadePercentage,
        handleLastAppliedFileChange,
        fileSelectorIdCount, 
        setFileSelectorIdCount,
        getNewFileSelectorId,
        lastAppliedFile,
        initialColors,
        rfInstance,
        handleRfInstanceChange,
        handleEdgeDeletion,
        nodeIdCount,
        setNodeIdCount,
        getNewNodeId,
        globalCode,
        handleGlobalCodeChange,
        tabSize,
        tab,
        globalCodeLanguage,
        selectedNode,
        setSelectedNode,
        leftDockingPanelOpen,
        setLeftDockingPanelOpen,
        rightDockingPanelOpen,
        setRightDockingPanelOpen,
        globalOutputNumber,
        handleGlobalOutputNumber,
        globalFileName,
        handleGlobalFileNameChange
    };
    
    return (
        <RenFlowContext.Provider value={providerValues}>
            {children}
        </RenFlowContext.Provider>
    );
}

export function useRenFlow() {
    return useContext(RenFlowContext);
}
