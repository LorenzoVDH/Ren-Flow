import { HexColorPicker } from "react-colorful";
import { useRenFlow } from "./RenFlowContext";
import { useReactFlow } from "reactflow";
import darkenColour from "../helpers/DarkenColour";
import { saveAs } from 'file-saver';

const FileExportList = ({fileExportItems, onFileChange}) => {
    const { handleOnTabbableElementFocussed,
        textDarkenedShadePercentage,
        handleLastAppliedFileChange,
        selectedNode, setSelectedNode,
        globalFileName, handleGlobalFileNameChange } = useRenFlow();
    const { getNodes, setNodes, getEdges } = useReactFlow();

    const onRenameFile = (e, id) => {
        const newFileName = e.target.value;        
        const nameToLookFor = fileExportItems.find(f => f.id === id).name;

        // if (fileExportItems.some(f => f.name === newFileName)){
        //     window.alert("A file with the same name already exists");
        //     return;
        // }

        // if (newFileName.trim() === ""){
        //     window.alert("File cannot be empty");
        //     return;
        // }

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
        if (fileExportItems.length === 1){
            window.alert("Cannot delete the last file in the filelist");
            return; 
        }
        if (window.confirm('Would you like to delete this file?')) {
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
            <ul style={{ width: '100%', listStyleType: 'none', padding: '0px', margin: '10px 0px' }}>
                {fileExportItems.map((item) => (
                    <li key={item.id} style={{ width: '100%', backgroundColor: item.color }}>
                        {/* {item.id} */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <input style={{ margin: '5px', width: '50%', backgroundColor: item.color }}
                                type='text'
                                value={item.name}
                                onChange={(e) => onRenameFile(e, item.id)}
                                onFocus={() => handleOnTabbableElementFocussed(true)}
                                onBlur={() => handleOnTabbableElementFocussed(false)} />
                            <div style={{ margin: '5px' }}>
                                <button style={{ height: '24px' }} onClick={() => removeFileListItem(item.id)}>×</button>
                                <button style={{ height: '24px' }} onClick={() => onSetColorPickerActive(item.id)}>🎨</button>
                                <button style={{ height: '24px' }} onClick={() => onApplyExportFile(item.id)}>Apply</button>
                            </div>
                            <div style={{ margin: '5px' }}>
                                <button style={{ height: '24px' }} onClick={() => onMoveFileOrder(item.id, 'up')}>↑</button>
                                <button style={{ height: '24px' }} onClick={() => onMoveFileOrder(item.id, 'down')}>↓</button>
                            </div>
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