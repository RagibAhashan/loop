import React from 'react';

interface Props {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProxyModal: React.FunctionComponent<Props> = () => {
    return <div> add proxy modal</div>;
};

export default AddProxyModal;
