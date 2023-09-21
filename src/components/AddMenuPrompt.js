import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRenFlow } from './RenFlowContext';
import './AddMenuPrompt.css'; // Import your CSS file

const AddMenuPrompt = () => {
    const { globalCode, handleGlobalCodeChange } = useRenFlow();
    const [menuQuestion, setMenuQuestion] = useState('');
    const [menuOptions, setMenuOptions] = useState(['', '', '', '', '']);
    const [renPyMenuText, setRenPyMenuText] = useState('');
    const [pleaseHandleCodeChange, setPleaseHandleCodeChange] = useState(false);

    const activateAddMenuPrompt = () => {
        Swal.fire({
            title: 'Add Menu',
            html: `
                <div class="custom-dialog">
                    <input
                        type="text"
                        id="menuQuestion"
                        class="swal2-input"
                        value="${menuQuestion}"
                        required
                        oninput="updateMenuQuestion(this)"
                    />
                    <label for="menuOptions" class="center-label"> Options:</label>
                    <div id="menuOptions">
                        ${menuOptions.map((option, index) => `
                            <div class="menu-option">
                                <input
                                    type="text"
                                    class="swal2-input menu-option-input"
                                    value="${option}"
                                    required
                                    oninput="updateMenuOption(this, ${index})"
                                />
                            </div>
                        `).join('')}
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Insert',
            cancelButtonText: 'Cancel',
            customClass: {
                container: 'custom-swal-container',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setPleaseHandleCodeChange(true);
            }
        });
    };


    useEffect(() => {
        if (pleaseHandleCodeChange) {
            handleGlobalCodeChange(globalCode + renPyMenuText);
            setPleaseHandleCodeChange(false);
        }
    }, [pleaseHandleCodeChange, globalCode, renPyMenuText, setPleaseHandleCodeChange]);

    // Event listener for updating menu question
    window.updateMenuQuestion = (input) => {
        setMenuQuestion(input.value);
        composeRenPyOutput();
    };

    // Event listener for updating menu option
    window.updateMenuOption = (input, index) => {
        const updatedOptions = [...menuOptions];
        updatedOptions[index] = input.value;
        setMenuOptions(updatedOptions);
        composeRenPyOutput();
    };

    const composeRenPyOutput = () => {
        const nonEmptyOptions = menuOptions.filter(option => option.trim() !== '');
        const formattedMenuQuestion = `    "${menuQuestion}"`;
        const formattedMenuOptions = nonEmptyOptions.map(option => `    "${option}":\n        \n`).join('\n');
        const renPyMenuText = `menu:\n${formattedMenuQuestion}\n\n${formattedMenuOptions}`;

        setRenPyMenuText(renPyMenuText);
    };

    return (
        <div>
            <button onClick={activateAddMenuPrompt} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span role="img" aria-label="menu" style={{ fontSize: '36px' }}>
                    📋
                </span>
                <span style={{ fontSize: '14px' }}>Add Menu</span>
            </button>
        </div>
    );
}

export default AddMenuPrompt;
