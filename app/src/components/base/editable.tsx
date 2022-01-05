import React, { useRef, useState } from 'react';

interface Props {
    value: string;
    onSubmit: (value: string) => void;
}
const Editable: React.FunctionComponent<Props> = (props) => {
    const { value, onSubmit } = props;

    const [isEditing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleStopEditing = () => {
        console.log('before trim', inputRef.current, inputRef.current.value);
        if (!inputRef.current.value) {
            setTimeout(() => setEditing(false), 100);
            return;
        }

        const newValue = inputRef.current.value.trim();

        console.log('new value', newValue, value);
        if (newValue !== value && newValue.length > 0) {
            console.log('submitting', newValue, value);

            onSubmit(newValue);
        }

        setTimeout(() => setEditing(false), 100);
    };

    const handleDoubleClick = () => {
        setEditing(true);

        setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.select();
        });
    };
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleStopEditing();
            return;
        }

        if (e.key === 'Escape') {
            e.stopPropagation();
            inputRef.current.value = value;
            handleStopEditing();
        }
    };
    return (
        <div>
            {isEditing ? (
                <input className="editable" defaultValue={value} type="text" ref={inputRef} onBlur={handleStopEditing} onKeyPress={handleKeyPress} />
            ) : (
                <span onDoubleClick={handleDoubleClick}> {value} </span>
            )}
        </div>
    );
};

export default Editable;
