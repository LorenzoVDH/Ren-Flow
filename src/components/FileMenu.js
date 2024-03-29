import { useCallback } from "react";
import { useRenFlow } from "./RenFlowContext";
import JSZip from "jszip";
import { useReactFlow } from "reactflow";
import { saveAs } from 'file-saver';
import Swal from "sweetalert2";

const FileMenu = ({ fileExportItems, onFileChange }) => {
    const { projectTitle, 
            handleProjectTitleChange,
            rfInstance,
            handleEdgeDeletion,
            nodeIdCount, setNodeIdCount,
            setFileSelectorIdCount, fileSelectorIdCount,
            handleLastAppliedFileChange,
            createSaveObject,
            handleSketchPadChange} = useRenFlow();
    const { getNodes, setNodes, getEdges, setEdges, setViewport } = useReactFlow();
    
    const handleNewFile = () => {
        Swal.fire({
            title: "Would you like to create a new project?",
            text: "Your unsaved progress will be lost!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        }); 
    }

    const handleOpenFile = useCallback(() => {
        setNodes([]);
        setEdges([]);
        const fileInput = document.createElement("input");
        fileInput.type = "file";

        fileInput.addEventListener("change", async (event) => {
            const file = event.target.files[0];
            const fileReader = new FileReader();

            fileReader.onload = function (event) {
                try {
                    const flow = JSON.parse(event.target.result);
                    console.log("Flow", flow.nodes); 
                    if (flow) {
                        setOpenFile(flow);
                    }
                } catch {
                    Swal.fire("Something went wrong while opening the file.\n\nAre you sure it's a RenFlow project?");
                }
            };

            fileReader.readAsText(file);
        });
        
        fileInput.click();
    }, [setNodes, setEdges, setViewport, onFileChange, handleProjectTitleChange]);
    
    const handleExportFile = useCallback(() => {
        if (projectTitle === undefined || projectTitle === null || projectTitle.trim() === '') {
            Swal.fire("Please enter a project title.");
            return;
        }

        if (rfInstance) {
            const zip = new JSZip();
            const codeFolder = zip.folder('game/scripts');
            const storyTextFolder = zip.folder('story/textExport');
            const storyProjectFolder = zip.folder('story');
            
            fileExportItems.forEach((f) => {
                let finalPrint = '';
                let finalStoryPrint = '';
                const nodesForFile = getNodes().filter((n) => (n.data.fileId === f.id && n.type === 'sceneNode'));
                const sortedNodesForFile = nodesForFile.sort((a, b) => Number(a.y) - Number(b.y));
                const sortedNodesForFileIds = sortedNodesForFile.map((n) => n.id);
                const edgesForFile = getEdges().filter((e) => {
                    return (
                        sortedNodesForFileIds.includes(e.source) || sortedNodesForFileIds.includes(e.target)
                    );
                });
                const targetsForFile = edgesForFile.map((e) => e.target);
                const nodesWithNoInput = sortedNodesForFile.filter((n) => !targetsForFile.includes(n.id));
                
                // Function to recursively add codeInput of nodes and their child nodes
                const addNodeAndChildrenCodeInput = (node) => {
                    finalPrint += node.data.codeInput + '\n\n';
                    finalStoryPrint += node.data.descriptionInput + '\n\n'; 

                    const childEdges = edgesForFile.filter((e) => e.source === node.id);
                    const childEdgesSorted = childEdges.sort((edgeA, edgeB) => {
                        const sourceNodeA = sortedNodesForFile.find((node) => node.id === edgeA.source);
                        const sourceNodeB = sortedNodesForFile.find((node) => node.id === edgeB.source);
                        const targetNodeA = sortedNodesForFile.find((node) => node.id === edgeA.target);
                        const targetNodeB = sortedNodesForFile.find((node) => node.id === edgeB.target);

                        const sourceAX = sourceNodeA?.position.x || 0;
                        const sourceBX = sourceNodeB?.position.x || 0;
                        const targetAX = targetNodeA?.position.x || 0;
                        const targetBX = targetNodeB?.position.x || 0;

                        // Sort primarily by source node's x-position, and secondarily by target node's x-position
                        if (sourceAX === sourceBX) {
                            return targetAX - targetBX;
                        }

                        return sourceAX - sourceBX;
                    }); 

                    childEdgesSorted.forEach((edge) => {
                        const edgeTarget = sortedNodesForFile.find(n => n.id === edge.target);
                        
                        if (edgeTarget){
                            addNodeAndChildrenCodeInput(edgeTarget);
                        }
                    });
                };

                nodesWithNoInput.forEach((n) => {
                    addNodeAndChildrenCodeInput(n);
                });

                if (f.name === undefined || f.name === null || f.name.trim() === '') {
                    Swal.fire("One of the files has no name.");
                    return;
                } else {
                    codeFolder.file(f.name, finalPrint);
                    var originalFileName = f.name; 
                    var newFileName = "story_" + originalFileName.replace(/\.[^/.]+$/, "") + ".txt";
                    storyTextFolder.file(newFileName, finalStoryPrint);
                }
            });

            const saveJSON = createSaveObject();
            storyProjectFolder.file(projectTitle + ".json", saveJSON);

            zip.generateAsync({ type: "blob" }).then(c => { saveAs(c, projectTitle) });
        }
    }, [rfInstance, fileExportItems, projectTitle, nodeIdCount]);
    
    const handleSaveFile = useCallback(() => {
        if (projectTitle === undefined || projectTitle === null || projectTitle.trim() === '') {
            Swal.fire("Please enter a project title.");
            return;
        }

        if (rfInstance){
            const saveJSON = createSaveObject();
            const blob = new Blob([saveJSON], { type: 'application/json' });
            saveAs(blob, projectTitle + ".json"); 
        }
    }, [rfInstance, projectTitle, nodeIdCount]);

    const setOpenFile = (flow) => {
        onFileChange([]);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        flow.nodes.forEach((n) => {
            n.data = { ...n.data,  onHandleDelete: handleEdgeDeletion };
        });
        setNodes(flow.nodes);
        setEdges(flow.edges);
        setViewport({ x, y, zoom });
        setNodeIdCount(flow.nodeIdCount);
        setFileSelectorIdCount(flow.fileSelectorIdCount);
        handleLastAppliedFileChange(1);
        handleProjectTitleChange(flow.projectTitle);
        onFileChange(JSON.parse(flow.fileExportItems));
        handleSketchPadChange(flow.sketchPad); 
    }

    return (
        <div style={{ width: '40%', display: 'flex', flexDirection: 'row' }}>
            <button style={{ height: '60px', fontSize: '40px', textAlign: 'center',  margin: '5px', flex: '1' }} onClick={handleNewFile}>📄</button>
            <button style={{ height: '60px', fontSize: '40px', textAlign: 'center',  margin: '5px', flex: '1' }} onClick={handleSaveFile}>💾</button>
            <button style={{ height: '60px', fontSize: '40px', textAlign: 'center',  margin: '5px', flex: '1' }} onClick={handleExportFile}>⏏️</button>
            <button style={{ height: '60px', fontSize: '40px', textAlign: 'center',  margin: '5px', flex: '1' }} onClick={handleOpenFile}>📁</button>
        </div>);
}

export default FileMenu; 