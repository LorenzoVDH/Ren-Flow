import DockingPanel from "./DockingPanel";
import FileMenu from "./FileMenu";
import ChangeableText from "./ChangeableText";
import { useRenFlow } from "./RenFlowContext";
import FileExportList from "./FileExportList";
import AddFileInput from "./AddFileInput";
    
const LeftDockingPanel = ({ onNew, onOpen, onSave, onExport }) => {
    const { projectTitle, handleProjectTitleChange, 
            anyElementFocussed, handleOnAnyElementFocussed, 
            fileList, handleFileListChange,
            leftDockingPanelOpen} = useRenFlow();

    const panelContentOpen = (
        <>
            <FileMenu fileExportItems = {fileList} onFileChange = { handleFileListChange } />
            <ChangeableText text={projectTitle} onSetText={handleProjectTitleChange} onElementFocussed={handleOnAnyElementFocussed} />

            <div style={{ height: 'calc(100% - 60px)', overflowY: 'auto', margin: '15px' }}>
                <h2>Files to Export</h2>
                <AddFileInput   fileExportItems = { fileList } onFileChange = { handleFileListChange } />
                <FileExportList fileExportItems = { fileList } onFileChange = { handleFileListChange } />
            </div>
        </>
    )

    return <DockingPanel props={{ panelContentOpen, onNew, onOpen, onSave, onExport }} side='left' panelOpen={leftDockingPanelOpen} panelWidth='30%' showFullPanel={false}/>;
}

export default LeftDockingPanel;