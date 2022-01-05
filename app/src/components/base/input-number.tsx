import { FieldAttributes, useField } from 'formik';
import React from 'react';

type Props = { label: string } & FieldAttributes<{}>;

const InputNumber: React.FunctionComponent<Props> = (props) => {
    const { label, ...formikProps } = props;
    const [field] = useField(props);
    return (
        <div>
            <label>
                {label}
                <input onChange={field.onChange} step={1} type="number" />
            </label>
        </div>
    );
};

export default InputNumber;
