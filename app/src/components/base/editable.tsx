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
        if (!inputRef.current) return;

        if (!inputRef.current.value) {
            setTimeout(() => setEditing(false), 100);
            return;
        }

        const newValue = inputRef.current.value.trim();

        if (newValue !== value && newValue.length > 0) {
            onSubmit(newValue);
        }

        setTimeout(() => setEditing(false), 100);
    };

    const handleDoubleClick = () => {
        setEditing(true);

        setTimeout(() => {
            if (!inputRef.current) return;

            inputRef.current.focus();
            inputRef.current.select();
        });
    };
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (!inputRef.current) return;

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
                <input className="editable" defaultValue={value} type="text" ref={inputRef} onBlur={handleStopEditing} onKeyDown={handleKeyPress} />
            ) : (
                <span onDoubleClick={handleDoubleClick}> {value} </span>
            )}
        </div>
    );
};

export default Editable;
