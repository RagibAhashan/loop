import { Button, Input, message, Upload } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;
const { Dragger } = Upload;

const beforeUpload = (file: any) => {
    const isTxt = file.type.contains('text');

    if (!isTxt) {
        message.error('Only text files are accepted');
    }

    return isTxt;
};

interface Props {
    onAddProxies: (proxies: string[]) => void;
}

const CopyProxy: React.FunctionComponent<Props> = (props) => {
    const { onAddProxies } = props;

    let [copiedProxies, setCopiedProxies] = useState('');

    const handleAddCopiedProxies = () => {
        const proxies: string[] = copiedProxies.trim().split('\n');
        onAddProxies(proxies);
    };
    return (
        <div>
            <TextArea
                value={copiedProxies}
                onChange={(e) => setCopiedProxies(e.target.value)}
                placeholder={'Copy paste your proxies here \nFormat should be: \nip:port:username:password'}
                rows={5}
            />
            <Button onClick={handleAddCopiedProxies}> Add </Button>
        </div>
    );
};

export default CopyProxy;
