import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactFlow, { useNodesState, useEdgesState, ReactFlowProvider, useReactFlow, addEdge, Panel, useKeyPress } from "reactflow";
import SceneNode from "./components/SceneNode";
import "reactflow/dist/style.css";
import useKeypress from "react-use-keypress";
import darkenColour from "./helpers/DarkenColour.js";
import LeftDockingPanel from "./components/LeftDockingPanel";
import { RenFlowContext, RenFlowProvider, useRenFlow } from "./components/RenFlowContext";
import RightDockingPanel from "./components/RightDockingPanel";
import TouchActionsPanel from "./components/TouchActionsPanel";
import { saveAs } from "file-saver";

const nodeTypes = {
  sceneNode: SceneNode
};

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  console.log("rightclicked"); 
});

const StoryBuilderInteractive = () => {
  const { 
          anyElementFocussed, 
          tabbableElementFocussed, 
          handleRfInstanceChange, 
          nodeIdCount, 
          leftDockingPanelOpen, setLeftDockingPanelOpen,
          rightDockingPanelOpen, setRightDockingPanelOpen,
          deleteNodeHandler,
          newNodeHandler,
          globalShowCode,
          handleGlobalShowCodeChange,
          projectTitle,
          createSaveObject,
          rfInstance} = useRenFlow();


  const handleEdgeDeletion = (sourceHandleToRemove) => {
    const theEdges = getEdges();
    const filteredEdges = theEdges.filter((e) => e.sourceHandle?.toString() !== sourceHandleToRemove?.toString());
    setEdges(filteredEdges);
  };

  const initialNodes = [];

  //const initialNodes = [];
  const initialEdges = [];
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project, getZoom, getNodes, getEdges, setViewport, zoomIn, zoomOut, fitView, zoomTo } = useReactFlow();
  const [showCodePanel, setShowCodePanel] = useState(true);
  const [showMultiOptions, setShowMultiOptions] = useState(false);

  const getNumberOfNodes = () => {
    return getNodes().filter((n) => n.type === 'sceneNode').length || 0;
  }


  const setExportOrder = (order) => {
    const selectedNodes = getNodes().filter((n) => (n.selected && n.type === 'sceneNode'));
    let updatedNodes = getNodes();

    if (order === 'x') {
      selectedNodes.sort((a, b) => a.position.x - b.position.x);
    } else if (order === 'y') {
      selectedNodes.sort((a, b) => a.position.y - b.position.y);
    }

    selectedNodes.forEach((node, index) => {
      node.data.exportIndex = index + 1;
      node.data.editMode = true;
      node.selected = false;
    });

    updatedNodes = updatedNodes.filter((node) => !(node.selected && node.type === 'sceneNode')).map((node) => ({ ...node, selected: false }));
    updatedNodes.push(...selectedNodes);
    handleGlobalShowCodeChange(true);
    setNodes(updatedNodes);
  };

  // Use the 'useKeypress' hook to toggle 'showCode' when Enter key is pressed.
  useKeypress('Tab', (e) => {
    if (!tabbableElementFocussed) {
      e.preventDefault();
    }
    if ((!anyElementFocussed && !tabbableElementFocussed)) {
      handleGlobalShowCodeChange();
    }
  });

  useKeypress('c', (e) => {
    if (!anyElementFocussed && !tabbableElementFocussed) {
      setRightDockingPanelOpen(!rightDockingPanelOpen);
    }
  });

  useKeypress('f', (e) => {
    if (!anyElementFocussed && !tabbableElementFocussed) {
      setLeftDockingPanelOpen(!leftDockingPanelOpen);
    }
  });

  useKeypress('v', (e) => {
    if (!anyElementFocussed && !tabbableElementFocussed) {
      fitView();
      zoomTo(1.5);
    }
  });

  useKeypress(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'], (e) => {
    e.preventDefault();
  });

  useKeypress('+', (e) => {
    if (!anyElementFocussed && !tabbableElementFocussed) {
      e.preventDefault();
      zoomIn();
    }
  });

  useKeypress('-', (e) => {
    if (!anyElementFocussed && !tabbableElementFocussed) {
      e.preventDefault();
      zoomOut();
    }
  });

  useKeypress(['Delete', 'Backspace'], () => {
    deleteNodeHandler();
  });

  const onConnect = useCallback((params) => {
    console.log(params);
    const sourceNode = getNodes().find(n => n.id === params.source); 
    const targetNode = getNodes().find(n => n.id === params.target); 

    console.log(sourceNode.data.fileId);
    console.log(targetNode.data.fileId);

    // if (sourceNode.data.fileId != targetNode.data.fileId){
    //   window.alert("Nodes need to be of the same file in order to be connected!");
    //   return; 
    // }

    if (sourceNode.id === targetNode.id){
      window.alert("You can't connect a node to itself!");
      return; 
    }

    const newEdges = addEdge(params, edges);
    setEdges(newEdges);
    console.log(params); 
  }, [edges]); 

  useEffect(() => {
    const theNodes = getNodes();
    const updatedNodes = theNodes.map((node) => ({
      ...node, data: { ...node.data, showCode: globalShowCode, },
    }));
    setNodes(updatedNodes);
  }, [globalShowCode]);

  const onDoubleClick = (event) => {
    newNodeHandler(event, reactFlowWrapper, false);
  };

  return (
    <ReactFlow
      ref={reactFlowWrapper}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onDoubleClick={onDoubleClick}
      onConnect={onConnect}
      zoomOnDoubleClick={false}
      maxZoom={3.5}
      minZoom={0.3}
      onInit={handleRfInstanceChange}
      fitView
      zoomto={1}
      deleteKeyCode={[]}>
        <TouchActionsPanel reactFlowWrapper={reactFlowWrapper} />
        <LeftDockingPanel />
        <RightDockingPanel /> 
        {/* {showMultiOptions ?
          <Panel position="top-center">
            <button onClick={() => setExportOrder('x')}>Set Export Order By X</button>
            <button onClick={() => setExportOrder('y')}>Set Export Order By Y</button>
          </Panel> :
          <></>
        } */}
        {/* <Panel position={"bottom-right"}>
          <div>{nodeIdCount}</div>
        </Panel> */}
    </ReactFlow>
  );
};

const storyBuilder = () => (
  <ReactFlowProvider>
    <RenFlowProvider>
      <StoryBuilderInteractive />
    </RenFlowProvider>
  </ReactFlowProvider>
);

export default storyBuilder; 