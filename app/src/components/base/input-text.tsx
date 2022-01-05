import { useField } from 'formik';
import React from 'react';

const InputText: React.FunctionComponent<any> = (props) => {
    const [field] = useField(props);
    return (
        <div>
            <input {...field} step={1} style={{ backgroundColor: 'black' }} type="input"></input>
        </div>
    );
};

export default InputText;
