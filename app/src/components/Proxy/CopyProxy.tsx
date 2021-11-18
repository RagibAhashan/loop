import { Form, Input, message, Upload } from 'antd';
import React from 'react';

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

    const handleAddCopiedProxies = (values: { copiedProxies: string }) => {
        const proxies: string[] = values.copiedProxies.trim().split('\n');
        onAddProxies(proxies);
    };
    return (
        <div>
            <Form id="prForm" onFinish={handleAddCopiedProxies}>
                <Form.Item name="copiedProxies" rules={[{ required: false, message: 'Please input the list of proxies to add!' }]}>
                    <Input.TextArea
                        rows={5}
                        autoSize={{ maxRows: 10, minRows: 10 }}
                        style={{ height: '150px', backgroundColor: 'rgba(40,44,41,0.5)' }}
                        placeholder={'Copy paste your proxies here \nFormat should be: ip:port:username:password'}
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

export default CopyProxy;
