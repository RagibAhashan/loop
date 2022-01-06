import React from 'react';

interface Props {
    label: string;
}

const TextInput: React.FunctionComponent<Props> = (props) => {
    const { label } = props;

    return (
        <div>
            <label>
                {label} <input />
            </label>
        </div>
    );
};

export default TextInput;
