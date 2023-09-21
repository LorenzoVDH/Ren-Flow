import React, { useRef, createContext, useContext, useEffect, useState, useCallback } from 'react';
import randomLightColour from '../helpers/RandomLightColour';
import { useReactFlow, useOnSelectionChange } from 'reactflow';
import { highlight, languages } from 'prismjs/components/prism-core';
import darkenColour from '../helpers/DarkenColour';
import { saveAs } from 'file-saver';
import Swal from "sweetalert2";

const RenFlowContext = createContext();

export function RenFlowProvider({ children }) {
    const { project, getZoom, getNodes, setNodes, getEdges, setEdges } = useReactFlow();
    const initialColors = [randomLightColour(), randomLightColour()];
    const [projectTitle, setProjectTitle] = useState('untitled');
    const [anyElementFocussed, setAnyElementFocussed] = useState(false);
    const [tabbableElementFocussed, setTabbableElementFocussed] = useState(false);
    const [fileList, setFileList] = useState([
        {
            id: 1,
            name: "init.rpy",
            color: initialColors[0],
            showColorPicker: false,
            visible: true
        }
    ]);
    const [textDarkenedShadePercentage, setTextDarkenedShadePercentage] = useState(10);
    const [lastAppliedFile, setLastAppliedFile] = useState(1);
    const [fileSelectorIdCount, setFileSelectorIdCount] = useState(fileList.length + 1);
    const [nodeIdCount, setNodeIdCount] = useState(1);
    const [rfInstance, setRfInstance] = useState(null); 
    const [globalCode, setGlobalCode] = useState('');
    const [globalShowCode, setGlobalShowCode] = useState(false); 
    const [selectedNode, setSelectedNode] = useState(undefined);
    const [leftDockingPanelOpen, setLeftDockingPanelOpen] = useState(false); 
    const [rightDockingPanelOpen, setRightDockingPanelOpen] = useState(false); 
    const [globalOutputNumber, setGlobalOutputNumber] = useState(0);
    const [globalFileName, setGlobalFileName] = useState(""); 
    const [codeEditorFontSize, setCodeEditorFontSize] = useState(localStorage.getItem("fontSize") || 18);
    const [ideaSketchPadOpen, setIdeaSketchpadOpen] = useState(false); 
    const [ideaSketchPadInput, setIdeaSketchPadInput] = useState(''); 
    
    const handleCodeEditorFontSizeChange = (newSize) => {
        if (!isNaN(newSize)) {
            localStorage.setItem("fontSize", newSize);
            setCodeEditorFontSize(newSize);
        }
    }; 

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

    useEffect(() => {
        console.log("rfInstanceChange", rfInstance); 
    }, [rfInstance, setRfInstance]);
    

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
    
    const handleOpenIdeaSketchPad = (ideaSketchPadState) => {
        setIdeaSketchpadOpen(ideaSketchPadState); 
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
        console.log(instance); 
        setRfInstance(instance);
    }

    const handleEdgeDeletion = (sourceHandleToRemove) => {
        const theEdges = getEdges();
        const filteredEdges = theEdges.filter((e) => e.sourceHandle?.toString() !== sourceHandleToRemove?.toString());
        setEdges(filteredEdges);
    }

    const handleGlobalShowCodeChange = () => {
        setGlobalShowCode(!globalShowCode); 
    }

    const deleteNodeHandler = () => {
        const deleteNode = () => {
            setNodes((nds) => nds.filter((node) => !node.selected));
        }
        const deleteEdge = () => {
            setEdges((edg) => edg.filter((edge) => !edge.selected));
        };

        const isNodeSelected = getNodes().some((node) => (node.selected && !node.data.textEditorFocussed));

        if (!anyElementFocussed && !tabbableElementFocussed) {

            if (isNodeSelected) {
                Swal.fire({
                    title: "Would you like to delete this/these node(s)?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                }).then((result) => {
                    if (result.isConfirmed) {
                        deleteNode();
                        deleteEdge();
                    }
                });
            } else {
                deleteEdge();
            }
        }
    }

    const newNodeHandler = (event, reactFlowWrapper, createdFromButton) => {
        const lastFile = fileList.find((file) => file.id === lastAppliedFile);
        const targetIsPane = event.target.classList.contains('react-flow__pane');
        const colour = lastFile ? lastFile.color : 'white';
        const fileId = lastFile ? lastFile.id : -1;

        if (targetIsPane || createdFromButton) {

            if (!lastFile.visible){
                Swal.fire("The selected file is not visible, can't add invisible nodes.");
                return;
            }

            const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
            const id = getNewNodeId().toString();
            let creationPositionX, creationPositionY;

            if (createdFromButton) {
                creationPositionX = window.innerWidth / 2;
                creationPositionY = window.innerHeight / 2;
            } else {
                creationPositionX = event.clientX;
                creationPositionY = event.clientY;
            }
            
            const newNode = {
                id: id,
                position: project({ x: creationPositionX - left - (75 * getZoom()), y: creationPositionY - top - (32 * getZoom()) }),
                type: 'sceneNode',
                data: {
                    label: `Node ${id}`,
                    onHandleDelete: handleEdgeDeletion,
                    codeInput: ``,
                    showCode: globalShowCode,
                    textEditorFocussed: false,
                    textColor: darkenColour(colour, textDarkenedShadePercentage),
                    fileId: fileId,
                    outputNumber: 1
                },
                style: { width: 150, height: 64, backgroundColor: colour },
            };

            setNodes((nds) => nds.concat(newNode));
        }
    }
    
    const createSaveObject = () => {
        const flow = rfInstance.toObject();
        flow.nodeIdCount = nodeIdCount;
        flow.fileSelectorIdCount = fileSelectorIdCount;
        flow.fileExportItems = JSON.stringify(fileList);
        flow.projectTitle = projectTitle;
        flow.sketchPad = ideaSketchPadInput; 

        return JSON.stringify(flow);
    }

    const handleSketchPadChange = (newText) => {
        setIdeaSketchPadInput(newText); 
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
        globalShowCode,
        handleGlobalShowCodeChange,
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
        handleGlobalFileNameChange,
        deleteNodeHandler,
        newNodeHandler,
        createSaveObject,
        codeEditorFontSize,
        handleCodeEditorFontSizeChange,
        ideaSketchPadOpen,
        handleOpenIdeaSketchPad,
        ideaSketchPadInput, 
        handleSketchPadChange
    };
    
    return (
        <RenFlowContext.Provider value={providerValues}>
            {children}
        </RenFlowContext.Provider>
    );
}

export function  useRenFlow() {
    return useContext(RenFlowContext);
}
