import { HexColorPicker } from "react-colorful";
import { useRenFlow } from "./RenFlowContext";
import { useReactFlow } from "reactflow";
import darkenColour from "../helpers/DarkenColour";
import { saveAs } from 'file-saver';
import Swal from "sweetalert2";

const FileExportList = ({fileExportItems, onFileChange}) => {
    const { handleOnTabbableElementFocussed,
        textDarkenedShadePercentage,
        handleLastAppliedFileChange,
        selectedNode, setSelectedNode,
        globalFileName, handleGlobalFileNameChange,
        lastAppliedFile } = useRenFlow();
    const { setEdges, getNodes, setNodes, getEdges } = useReactFlow();

    const onRenameFile = (e, id) => {
        const newFileName = e.target.value;        
        const nameToLookFor = fileExportItems.find(f => f.id === id).name;

        const updatedNodes = getNodes().map((node) => {
            if (node.data.fileName === nameToLookFor) {
                return { ...node, data: { ...node.data, fileName: newFileName } };
            }
            return node;
        });
        setNodes(updatedNodes);
        
        if (globalFileName === nameToLookFor){
            handleGlobalFileNameChange(newFileName); 
        }

        const updatedList = fileExportItems.map((item) => {
            if (item.id === id) {
                return { ...item, name: newFileName.trim() };
            }
            return item;
        });
        onFileChange(updatedList);
    }

    const onMoveFileOrder = (fileId, direction) => {
        const tempFileList = [...fileExportItems];
        const currentIndex = tempFileList.findIndex(item => item.id === fileId);

        if (currentIndex === -1 ||
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === tempFileList.length - 1)) {
            return;
        }

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        const temp = tempFileList[currentIndex];
        tempFileList[currentIndex] = tempFileList[newIndex];
        tempFileList[newIndex] = temp;

        onFileChange(tempFileList);
    };

    const removeFileListItem = (id) => {
        if (fileExportItems.length === 1) {
            Swal.fire("Cannot delete the last file in the filelist");
            return;
        }
        Swal.fire({
            title: "Would you like to delete this file?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                //const nameToLookFor = fileExportItems.find(f => f.id === id).name;

                const updatedNodes = getNodes().map((node) => {
                    if (node.data.fileId === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                fileName: '',
                                textColor: darkenColour('#FFFFFF', textDarkenedShadePercentage)
                            },
                            style: {
                                ...node.style,
                                backgroundColor: 'white'
                            }
                        };
                    }
                    return node;
                });

                const updatedList = fileExportItems.filter((item) => item.id !== id);

                onFileChange(updatedList);
                setNodes(updatedNodes);
            }
        });
    }

    const onApplyExportFile = (fileId) => {
        const { color } = fileExportItems.find((file) => file.id === fileId);

        const updatedNodes = getNodes().map((node) => {
            if (node.selected) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        fileId: fileId,
                        textColor: darkenColour(color, textDarkenedShadePercentage)
                    },
                    style: { ...node.style, backgroundColor: color }
                };
            }
            return node;
        });

        setNodes(updatedNodes);
        handleLastAppliedFileChange(fileId);
    }

    const onFileSetVisible = (fileId) => {
        const newFileExportItems = fileExportItems.map((f) => {
            if (f.id === fileId) {
                return {
                    ...f,
                    visible: !f.visible
                };
            }
            return f;
        });
    
        const affectedFile = newFileExportItems.find((f) => f.id === fileId);
    
        console.log(affectedFile.visible);
    
        const updatedNodes = getNodes().map((node) => {
            if (node.data.fileId === fileId) {
                return {
                    ...node,
                    selected: false,
                    data: {
                        ...node.data,
                    },
                    style: {
                        ...node.style,
                        display: affectedFile?.visible ? 'block' : 'none'
                    }
                };
            }
            return node;
        });
    
        const edges = getEdges();
    
        const updatedEdges = edges.map((edge) => {
            const sourceNode = updatedNodes.find((node) => node.id === edge.source);
            const targetNode = updatedNodes.find((node) => node.id === edge.target);
            
            if (sourceNode?.data.fileId === fileId || targetNode?.data.fileId === fileId) {
                return {
                    ...edge,
                    selected: false, 
                    style: {
                        ...edge.style,
                        display: affectedFile?.visible ? 'block' : 'none'
                    }
                };
            }
            return edge;
        });
    
        setNodes(updatedNodes);
        setEdges(updatedEdges); 
        onFileChange(newFileExportItems);
    }
    

    const onSetColorPickerActive = (fileId) => {
        const updatedList = fileExportItems.map((file) => {
            if (file.id === fileId) {
                file.showColorPicker = !file.showColorPicker;
            } else {
                file.showColorPicker = false;
            }
            return file;
        });

        onFileChange(updatedList);
    }

    const onChangeFileColor = (colour, item) => {
        const newFileExportItems = fileExportItems.map((f) => {
            if (f.id === item.id) {
                return {
                    ...f,
                    color: colour
                };
            }
            return f;
        });
        //applyExportFile(item.name, c);
        const updatedNodes = getNodes().map((node) => {
            if (node.data.fileId === item.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        textColor: darkenColour(colour, textDarkenedShadePercentage)
                    },
                    style: {
                        ...node.style,
                        backgroundColor: colour
                    }
                };
            }
            return node;
        });

        setNodes(updatedNodes);
        onFileChange(newFileExportItems);
    }

    return (
        <>
            <ul style={{ width: '99%', listStyleType: 'none', padding: '0px', margin: '10px 0px' }}>
                {fileExportItems.map((item) => (
                    <li key={item.id} style={{ width: '100%', backgroundColor: item.color }}>
                        {/* {item.id} */}
                        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        </div> */}
                        <input
                            style={{
                                margin: '5px',
                                fontSize: '30px',
                                height: '40px',
                                width: 'calc(100% - 10px)',
                                backgroundColor: item.color,
                                border: item.id === lastAppliedFile ? '3px dotted black' : 'none', // Add border style conditionally
                            }}
                            type='text'
                            value={item.name}
                            onChange={(e) => onRenameFile(e, item.id)}
                            onFocus={() => handleOnTabbableElementFocussed(true)}
                            onBlur={() => handleOnTabbableElementFocussed(false)}
                        />
                        <div style={{ maxWidth: '400px' }}>
                            <button style={{ height: '45px', width: '15%', fontSize: '20px' }} onClick={() => removeFileListItem(item.id)}>🗑️</button>
                            <button style={{ height: '45px', width: '15%', fontSize: '20px' }} onClick={() => onSetColorPickerActive(item.id)}>🎨</button>
                            <button style={{ height: '45px', width: '15%', fontSize: '20px' }} onClick={() => onFileSetVisible(item.id)}>{item.visible ? "👁️‍🗨️" : "-"}</button>
                            <button style={{ height: '45px', width: '25%', fontSize: '20px' }} onClick={() => onApplyExportFile(item.id)}>Set</button>
                            <button style={{ height: '45px', width: '15%', fontSize: '20px' }} onClick={() => onMoveFileOrder(item.id, 'up')}>↑</button>
                            <button style={{ height: '45px', width: '15%', fontSize: '20px' }} onClick={() => onMoveFileOrder(item.id, 'down')}>↓</button>
                        </div>
                        {item.showColorPicker && (
                            <HexColorPicker className='hidden' color={item.color} onChange={(c) => onChangeFileColor(c, item)} />
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
    
}

export default FileExportList; 