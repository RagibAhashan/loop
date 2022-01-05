import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { NewTaskModalProps, TaskFormValues } from '@components/AddTaskAction/AddTaskAction';
import InputNumber from '@components/base/input-number';
import ProfileSelectDropdown from '@components/base/profile-select-dropdown';
import { Field, Form, Formik } from 'formik';
import React from 'react';

export interface WalmartFormValues extends TaskFormValues {
    productQuantity: number;
    productSKU: string;
    offerId: string;
}

const WalmartNewTaskModal: React.FunctionComponent<NewTaskModalProps> = (props) => {
    const { isOpen, onClose, onAdd, profileGroups, proxySets } = props;

    const initialValues: WalmartFormValues = {
        offerId: '',
        productQuantity: 1,
        productSKU: '',
        profileName: '',
        retryDelay: 3000,
        proxySetName: '',
        quantity: 1,
    };

    // let proxiesOptions: any = proxySets.map((proxySet) => {
    //     return { label: proxySet.name, value: proxySet.name };
    // });

    // proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];
    // optionsProfiles = [...optionsProfiles, { label: 'No Profile', value: null }];

    const onSubmit = (data: WalmartFormValues) => {
        console.log('adding task data walmart', data);
        onAdd(data as WalmartFormValues, data.quantity);
    };

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ values }) => (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>New Task</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>test add new task modal</ModalBody>
                        <ProfileSelectDropdown profileGroups={profileGroups}></ProfileSelectDropdown>

                        <Form>
                            <Field name="offerId" type="input" placeholder="Offer ID" as={Input} />
                            <Field name="productSKU" type="input" placeholder="Product SKU" as={Input} />
                            <Field name="retryDelay" type="number" placeholder="Retry Delay" as={Input} />
                            <Field name="proxySetName" type="input" placeholder="Proxy" as={Input} />
                            <Field name="profileName" type="input" placeholder="Profile" as={Input} />
                            <Field name="quantity" type="number" placeholder="Task Quantity" as={InputNumber} />

                            <pre> {JSON.stringify(values, null, 2)}</pre>

                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} type="submit">
                                    Add
                                </Button>
                            </ModalFooter>
                        </Form>
                    </ModalContent>
                    {/* <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
                <Form form={form} onFinish={onFinishForm} validateMessages={validateMessages}>
                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <Form.Item name="productSKU" rules={[{ required: true }]}>
                                <Input placeholder="Product SKU"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="offerId" rules={[{ required: true }]}>
                                <Input placeholder="Offer ID"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={GUTTER}>
                        <Col span={12}>
                            <ProfileSelectDropdown profileGroups={profileGroups}></ProfileSelectDropdown>
                            <Form.Item name="profileName" rules={[{ required: false }]}>
                                    <Select placeholder="Profile" allowClear options={optionsProfiles} />
                                </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="proxySet" rules={[{ required: false }]} initialValue={null}>
                                <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={proxiesOptions} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={GUTTER}>
                        <Col span={8}>
                            <Form.Item name="productQuantity" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} placeholder="Product Quantity" value={1} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="retryDelay" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} placeholder="Retry delay" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item rules={[{ required: true }]}>
                                <InputNumber
                                    style={{ width: '100%' }}
                                    value={quantity}
                                    placeholder="Task Quantity"
                                    onChange={(value) => setQuantity(value)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={GUTTER}>
                        <Col span={18}>
                            <span></span>
                        </Col>

                        <Col span={6}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={buttonStyle}>
                                    Create Task
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>  */}
                </Modal>
            )}
        </Formik>
    );
};

export default WalmartNewTaskModal;
