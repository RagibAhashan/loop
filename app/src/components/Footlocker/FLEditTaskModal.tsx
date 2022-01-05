// import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
// import { useForm } from 'antd/lib/form/Form';
// import React, { useEffect } from 'react';
// import { getSizes } from '../../services/task/TaskUtils';

// const validateMessages = {
//     required: 'Required!',
// };
// const GUTTER: [number, number] = [16, 0];

// export const FLEditTaskModal = (props: any) => {
//     const { visible, onClose, onEdit, task, profiles, proxySets } = props;
//     const [form] = useForm();

//     let optionsProfiles = profiles.map((profile) => {
//         return { label: profile.profileName, value: profile.profileName };
//     });

//     let proxiesOptions: any = proxySets.map((proxySet) => {
//         return { label: proxySet.name, value: proxySet.name };
//     });

//     proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];
//     optionsProfiles = [...optionsProfiles, { label: 'No Profile', value: null }];

//     useEffect(() => {
//         form.resetFields();
//         form.setFieldsValue(task);
//     });

//     const title = () => {
//         if (!task) return '';
//         return Object.keys(task).length > 0 ? 'Edit Task' : 'Mass Edit All';
//     };

//     const removeUndefined = () => {
//         const values = form.getFieldsValue();
//         Object.keys(values).forEach((key) => values[key] === undefined && delete values[key]);
//         return values;
//     };

//     return (
//         <Modal
//             title={title()}
//             centered
//             visible={visible}
//             onOk={() => {
//                 Object.keys(task).length > 0
//                     ? form
//                           .validateFields()
//                           .then((values) => {
//                               //   form.resetFields();
//                               onEdit(values);
//                           })
//                           .catch((err) => {})
//                     : onEdit(removeUndefined());
//             }}
//             onCancel={onClose}
//             okText="Edit"
//             cancelText="Cancel"
//             width={600}
//         >
//             <Form form={form} validateMessages={validateMessages}>
//                 <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
//                     <Row gutter={GUTTER}>
//                         <Col span={24}>
//                             <Form.Item name="productSKU" rules={[{ required: true }]}>
//                                 <Input placeholder="Product SKU"></Input>
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={GUTTER}>
//                         <Col span={12}>
//                             <Form.Item name="profileName" rules={[{ required: true }]}>
//                                 <Select placeholder="Profile" allowClear options={optionsProfiles} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item name="proxySet" rules={[{ required: false }]}>
//                                 <Select style={{ width: '100%' }} placeholder="Proxy Set" allowClear options={proxiesOptions} />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row gutter={GUTTER}>
//                         <Col span={12}>
//                             <Form.Item name="sizes" rules={[{ required: true }]}>
//                                 <Select placeholder="Size" mode="multiple" allowClear>
//                                     {getSizes()}
//                                 </Select>
//                             </Form.Item>
//                         </Col>

//                         <Col span={12}>
//                             <Form.Item name="retryDelay" rules={[{ required: true }]}>
//                                 <InputNumber style={{ width: '100%' }} placeholder="Retry delay (ms)" />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                 </div>
//             </Form>
//         </Modal>
//     );
// };

// export default FLEditTaskModal;
