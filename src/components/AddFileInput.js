import { useState } from "react";
import randomLightColour from "../helpers/RandomLightColour";
import { useRenFlow } from "./RenFlowContext";

const AddFileInput = ({fileExportItems, onFileChange}) => {
    const [inputFileListValue, setInputFileListValue] = useState('');
    const { getNewFileSelectorId,
            lastAppliedFile, handleLastAppliedFileChange,
            handleOnTabbableElementFocussed } = useRenFlow(); 

    const onAddFileListItem = (id, fileName) => {
        if (!fileName.endsWith('.rpy')) {
            fileName += '.rpy';
        }

        let randomColor = randomLightColour();

        const fileNameExists = fileExportItems.find((f) => f.name === fileName);
        let createFile = false;

        if (!fileNameExists) {
            createFile = true;
        } else {
            window.confirm('This filename already exists.');
        }

        if (createFile) {
            onFileChange([...fileExportItems, { id: id, name: fileName, color: randomColor, showColorPicker: false }]);
        }
    }

    const onFileListSubmit = (event) => {
        event.preventDefault();

        if (inputFileListValue.trim() !== '' && inputFileListValue !== (null || undefined)) {
            const id = getNewFileSelectorId();
            
            onAddFileListItem(id, inputFileListValue);
            handleLastAppliedFileChange(id);
            setInputFileListValue('');
        }
    }

    return (
        <form onSubmit={(e) => onFileListSubmit(e)}>
            <input
                style={{ width: '75%' }}
                type='text'
                value={inputFileListValue.trim()}
                onChange={(e) => setInputFileListValue(e.target.value)}
                onFocus={() => handleOnTabbableElementFocussed(true)}
                onBlur={() => handleOnTabbableElementFocussed(false)} />
            <button style={{ margin: '0px 15px' }} type='submit'>Add</button>
        </form>
    )
}

export default AddFileInput; 