import { useState } from "react";
import randomLightColour from "../helpers/RandomLightColour";
import { useRenFlow } from "./RenFlowContext";
import Swal from "sweetalert2";

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
            Swal.fire('This filename already exists.');
        }

        if (createFile) {
            onFileChange([...fileExportItems, { id: id, name: fileName, color: randomColor, showColorPicker: false, visible: true }]);
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
                style={{ width: '100%', fontSize: '25px' }}
                type='text'
                value={inputFileListValue.trim()}
                onChange={(e) => setInputFileListValue(e.target.value)}
                onFocus={() => handleOnTabbableElementFocussed(true)}
                onBlur={() => handleOnTabbableElementFocussed(false)} />
            {/* <button style={{ width: '10%',  margin: '0px 15px', fontSize: '25px' }} type='submit'>+</button> */}
        </form>
    )
}

export default AddFileInput; 