// import { NewTaskModalProps, TaskFormValues } from '@components/actions/add-task-action';
// import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
// import React, { useState } from 'react';

// export interface WalmartFormValues extends TaskFormValues {
//     productQuantity: number;
//     productSKU: string;
//     offerId: string;
// }

// const WalmartNewTaskModal: React.FunctionComponent<NewTaskModalProps> = (props) => {
//     const { isOpen, setOpen, onAdd, profileGroups, proxySets } = props;

//     const [quantity, setQuantity] = useState(1);

//     const initialValues: WalmartFormValues = {
//         offerId: '',
//         productQuantity: 1,
//         productSKU: '',
//         profileName: '',
//         retryDelay: 3000,
//         proxySetName: '',
//         quantity: 1,
//     };
//     const [form] = Form.useForm<WalmartFormValues>();

//     const onFinishForm = async (data: any) => {
//         console.log('adding task data walmart', data);
//         // onAdd(data, quantity);
//     };

//     // let proxiesOptions: any = proxySets.map((proxySet) => {
//     //     return { label: proxySet.name, value: proxySet.name };
//     // });

//     // proxiesOptions = [...proxiesOptions, { label: 'No Proxies', value: null }];
//     // optionsProfiles = [...optionsProfiles, { label: 'No Profile', value: null }];

//     const onSubmit = (data: WalmartFormValues) => {
//         console.log('adding task data walmart', data);
//         onAdd(data, data.quantity);
//     };

//     return (
//         <Modal
//             visible={isOpen}
//             onCancel={() => setOpen(false)}
//             footer={
//                 <Button form="taskForm" type="primary" htmlType="submit">
//                     Create Task
//                 </Button>
//             }
//         >
//             <div style={{ padding: 24 }}>
//                 <Form form={form} onFinish={onFinishForm} validateMessages={{ required: '' }} id="taskForm">
//                     <Form.Item name="productSKU" label="Product SKU" required rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="offerId" label="Offer ID" rules={[{ required: true }]}>
//                         <Input></Input>
//                     </Form.Item>
//                     {/* <ProfileSelectDropdown profileGroups={profileGroups}></ProfileSelectDropdown> */}
//                     <Form.Item>
//                         <Select defaultValue={null} style={{ width: 200 }}>
//                             <Select.Option key={'null'} value={null}>
//                                 No Profile
//                             </Select.Option>

//                             {profileGroups.map((profileGroup) => {
//                                 return (
//                                     <Select.OptGroup key={profileGroup.id} label={profileGroup.name}>
//                                         {profileGroup.profiles.map((profile) => {
//                                             return (
//                                                 <Select.Option disabled key={profile.id} value={profile.profileName}>
//                                                     {profile.profileName}
//                                                 </Select.Option>
//                                             );
//                                         })}
//                                     </Select.OptGroup>
//                                 );
//                             })}
//                         </Select>
//                     </Form.Item>
//                     <Form.Item name="profileName" label="Profile" rules={[{ required: false }]}>
//                         <Select allowClear options={[{ value: null, label: 'Null' }]} />
//                     </Form.Item>
//                     <Form.Item name="proxySet" label="Proxy Set" rules={[{ required: false }]}>
//                         <Select style={{ width: '100%' }} allowClear options={[{ value: null, label: 'Null' }]} />
//                     </Form.Item>

//                     <Form.Item name="productQuantity" label="Product Quantity" rules={[{ required: true }]}>
//                         <InputNumber style={{ width: '100%' }} value={1} />
//                     </Form.Item>

//                     <Form.Item name="retryDelay" label="Retry Delay" rules={[{ required: true }]}>
//                         <InputNumber style={{ width: '100%' }} />
//                     </Form.Item>
//                     <Form.Item label="Task Quantity" rules={[{ required: true }]}>
//                         <InputNumber style={{ width: '100%' }} value={quantity} onChange={(value) => setQuantity(value)} />
//                     </Form.Item>
//                 </Form>
//             </div>
//         </Modal>
//     );
// };

// export default WalmartNewTaskModal;
