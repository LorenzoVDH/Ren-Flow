import DockingPanel from "./DockingPanel";
import FileMenu from "./FileMenu";
import ChangeableText from "./ChangeableText";
import { useRenFlow } from "./RenFlowContext";
import FileExportList from "./FileExportList";
import AddFileInput from "./AddFileInput";
import { useEffect } from "react";
    
const LeftDockingPanel = ({ onNew, onOpen, onSave, onExport }) => {
    const { projectTitle, handleProjectTitleChange, 
            handleOnAnyElementFocussed, 
            fileList, handleFileListChange,
            leftDockingPanelOpen} = useRenFlow();

    const panelContentOpen = (
        <>
            <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto', margin: '15px' }}>
                <FileMenu fileExportItems = {fileList} onFileChange = { handleFileListChange } />
                <ChangeableText text={projectTitle} onSetText={handleProjectTitleChange} onElementFocussed={handleOnAnyElementFocussed} fontSize={'48px'}/>
                <AddFileInput   fileExportItems = { fileList } onFileChange = { handleFileListChange } />
                <FileExportList fileExportItems = { fileList } onFileChange = { handleFileListChange } />
            </div>
        </>
    )

    return <DockingPanel props={{ panelContentOpen, onNew, onOpen, onSave, onExport }} side='left' panelOpen={leftDockingPanelOpen} panelWidth='100%' showFullPanel={false} controlButtonsSize='30px' />;
}

export default LeftDockingPanel;