const ChangeableText = ({ text, onSetText, onElementFocussed, fontSize }) => {
    return (
        <input 
            type='text' 
            spellCheck={false} 
            style={{ width: 'calc(100% - 30px)', margin: '10px', fontSize: fontSize, border: 'none', backgroundColor: 'transparent' }} 
            onChange={(e) => onSetText(e.target.value)} 
            value={text} 
            onFocus={() => onElementFocussed(true)} 
            onBlur={() => onElementFocussed(false)} />);
}

export default ChangeableText; 