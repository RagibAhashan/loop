// import { IProfile } from '@core/profile';
// import { IProxySet } from '@core/proxyset';
// import { ITask } from '@core/task';
// import { IWalmartTask } from '@core/walmart/walmart-task';
// import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
// import { useForm } from 'antd/lib/form/Form';
// import React, { useEffect } from 'react';

// const validateMessages = {
//     required: 'Required!',
// };
// const GUTTER: [number, number] = [16, 0];

// interface Props {
//     showModal: boolean;
//     setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
//     task: ITask;
//     massEdit: boolean;
//     proxySets: IProxySet[];
//     profiles: IProfile[];
// }

// export const WalmartEditTaskModal: React.FunctionComponent<Props> = (props) => {
//     const { proxySets, profiles, showModal, setShowModal, task, massEdit } = props;

//     const [form] = useForm<IWalmartTask>();

//     let optionsProfiles = profiles.map((profile) => {
//         return { label: profile.profileName, value: profile.profileName };
//     });

//     let proxiesOptions = proxySets.map((proxySet) => {
//         return { label: proxySet.name, value: proxySet.name };
//     });

//     proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];
//     optionsProfiles = [...optionsProfiles, { label: 'No Profile', value: null }];

//     useEffect(() => {
//         form.resetFields();
//         if (!massEdit) form.setFieldsValue(task);
//     });

//     const title = () => {
//         if (!task) return '';
//         return massEdit ? 'Mass Edit All' : 'Edit Task';
//     };

//     const removeUndefined = () => {
//         const values = form.getFieldsValue();
//         Object.keys(values).forEach((key) => values[key] === undefined && delete values[key]);
//         return values;
//     };

//     const handleOnEdit = (newTaskValues: IWalmartTask) => {
//         console.log('on edit');
//         // onEdit(newTaskValues);
//     };

//     return (
//         <Modal
//             title={title()}
//             centered
//             visible={showModal}
//             onOk={() => {
//                 Object.keys(task).length > 0
//                     ? form
//                           .validateFields()
//                           .then((values) => {
//                               //   form.resetFields();
//                               handleOnEdit(values);
//                           })
//                           .catch((err) => {})
//                     : handleOnEdit(removeUndefined());
//             }}
//             onCancel={() => setShowModal(false)}
//             okText="Edit"
//             cancelText="Cancel"
//             width={600}
//         >
//             <Form form={form} validateMessages={validateMessages}>
//                 <div style={{ padding: 24, backgroundColor: '#212427', borderRadius: '10px' }}>
//                     <Row gutter={GUTTER}>
//                         <Col span={12}>
//                             <Form.Item name="productSKU" rules={[{ required: true }]}>
//                                 <Input placeholder="Product SKU"></Input>
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item name="offerId" rules={[{ required: true }]}>
//                                 <Input placeholder="Offer ID"></Input>
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                     <Row gutter={GUTTER}>
//                         <Col span={12}>
//                             <Form.Item name="profileName" rules={[{ required: false }]}>
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

// export default WalmartEditTaskModal;
