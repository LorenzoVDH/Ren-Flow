const ChangeableText = ({ text, onSetText, onElementFocussed }) => {
    return (
        <input 
            type='text' 
            spellCheck={false} 
            style={{ width: '90%', margin: '10px', fontSize: '30px', border: 'none', backgroundColor: 'transparent' }} 
            onChange={(e) => onSetText(e.target.value)} 
            value={text} 
            onFocus={() => onElementFocussed(true)} 
            onBlur={() => onElementFocussed(false)} />);
}

export default ChangeableText; 