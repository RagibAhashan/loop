import React, { useState, useEffect } from 'react';
import {  Row, Col, Form, Input, Button, Divider, 
          Table, Modal, Tag, Space, Card, message,
          Upload, Layout, Menu, Dropdown, Tabs} from 'antd';
import { DownOutlined, PlusOutlined, DeleteOutlined, InboxOutlined, UserOutlined } from '@ant-design/icons';
import * as Constants from '../constants';
import '../App.global.css'
import { Tooltip } from '@material-ui/core';

const { Header, Content, Footer, Sider } = Layout;

const ProxyPage = (props: any) => {
  const { setPage } = props;
  const [proxies, setProxies] = useState(new Map<string, []>()); // name -> proxies
  const [proxyInput, setProxyInputs] = useState(new Map<number, []>()); // new sets being inputted by user (input_key -> nProxies)
  const [visible, setVisible] = useState(false);

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    setVisible(false);
  };


  useEffect(() => {
    let db_proxies: any = localStorage.getItem('proxies');
    if (!db_proxies) {
      db_proxies = new Map();
      localStorage.setItem('proxies', JSON.stringify(Array.from(db_proxies.entries())));
    } else {
      let tempProxyMap = new Map();
      for(let i = 0; i < JSON.parse(db_proxies).length; i++) {
        tempProxyMap.set(JSON.parse(db_proxies)[i][0], JSON.parse(db_proxies)[i][1])
      }
      setProxies(tempProxyMap);
    }
  }, []);

  const onFinish = (values: any) => {
    for(let i = 0; i < values.proxies.length; i++) {
      if (proxies.get(values.proxies[i].name)) {
        message.error(`Proxy Set "${values.proxies[i].name}" already exists!`)
        return null;
      }
      setProxies(proxies.set(values.proxies[i].name, values.proxies[i].proxy.split(" ")));
    }

    localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
    setPage(Constants.BILLING)
    setPage(Constants.PROXIES)
  };

  const onDeleteSet = (name: any) => {
    proxies.delete(name.toString());
    setProxies(proxies);
    localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())))
    forceUpdate()
  }

  const content = (values: any, name: any) => (
    <div>
      {/* <Row style={{textAlign: 'center'}}>
        <Col>
            <Divider style={{textAlign: 'center', width: 300}}> Name </Divider>
            <p> {name} </p>
        </Col>
      </Row> */}
      <Row style={{textAlign: 'center'}}>
        <Col>
            <Divider style={{textAlign: 'center', width: 350}}> Proxies </Divider>
            {showProxiesPopup(values)}
            <Button type="dashed" style={{marginTop: 10}} htmlType="submit" onClick={()=>{downloadProxies(values, name)}}> Download full list </Button>
        </Col>
      </Row>
      <Row style={{textAlign: 'center'}}>
        <Col>
            <Divider style={{textAlign: 'center', width: 350}}> No. of Proxies </Divider>
            <p> {values.length} </p>
        </Col>
      </Row>
    </div>
  );

  const downloadProxies = (values: [], name: string) => {
    const proxyFileName = name + "Proxies.txt";
    const valuesNewLine = [values.join("\r\n")];
    const element = document.createElement("a");
    const file = new Blob(valuesNewLine, {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = proxyFileName;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const showProxiesPopup = (proxies: []) => {
    const PROXIES_TO_SHOW = 15;
    const proxiesToShow = proxies.slice(0, PROXIES_TO_SHOW)
    return proxiesToShow.map((value) => {
      return (
        <div> { value } </div>
      )
    })
  }

  const ShowProxies = (proxies: Map<string, []>) => {
    let proxyArray = Array.from(proxies, ([name, proxies]) => ({ name, proxies }));
    if (!proxies.size) return (<h1>  </h1>)
    return proxyArray.map( (value) => {
      const ex = proxies.get(value.name) as Array<string>;
      return (
        // <Popover content={content(value.proxies, value.name)} placement="right">
            <Card size="small"
                title={value.name}
                extra={
                    <Button type="link" danger icon={<DeleteOutlined />}
                        onClick={() => onDeleteSet(value.name)}
                    />
                }
                style={{ width: '30%', height: '60%', margin: 25, marginLeft: 0, marginTop: 10}}
            >
              { content(value.proxies, value.name) }
                {/* <p> {`Preview: ${ex[0].substr(0, 12)}...`} </p>
                <p> {`No. of Proxies: ${ex.length}`} </p> */}

            </Card>
        // </Popover>
      )
    })
}

const realTimeNoProxies = (values: any, currentInputKey: number) => {
  setProxyInputs(proxyInput.set(currentInputKey, values.target.value.split(" ")));
}

function useForceUpdate(){
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}
const forceUpdate = useForceUpdate();

const CollectionCreateForm = ({ visible, onCreate, onCancel }:any) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new set"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please input the name of the set!',
            },
          ]}
        >
          <Input placeholder="Input set same"/>
        </Form.Item>
        <Form.Item 
          name="proxies"
          label="Proxies"
          rules={[
            {
              required: true,
              message: 'Please input the list of proxies!',
            },
          ]}
        >
          <Dragger {...prop}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to this area to upload</p>
            <p className="ant-upload-hint">
              Make sure that your list of proxies is separated by new lines!
            </p>
          </Dragger>
          {/* <Input type="textarea" placeholder="Copy Paste your list of proxies"/> */}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const { Dragger } = Upload;

const prop = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info: any) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const handleMenuClick = () => {

}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1" icon={<UserOutlined />}>
      1st menu item
    </Menu.Item>
    <Menu.Item key="2" icon={<UserOutlined />}>
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3" icon={<UserOutlined />}>
      3rd menu item
    </Menu.Item>
  </Menu>
);



const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text:any) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags:any) => (
      <>
        {tags.map((tag:any) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text:any, record:any) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const onChange = () => {

}

const { TabPane } = Tabs;

function callback(key:any) {
  console.log(key);
}

const Sets = () => (
  <Tabs defaultActiveKey="1" onChange={callback} style={{padding:'0 50px'}}>
    <TabPane tab="Tab 1" key="1">
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </TabPane>
    <TabPane tab="Tab 2" key="2">
      Content of Tab Pane 2
    </TabPane>
    <TabPane tab="Tab 3" key="3">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>
);


  return (
    <Layout>
      <Header>
        <Row>
          <Col span={2} style={{fontSize: 30}}> Proxies </Col>
          <Col span={22} style={{textAlign: 'right'}}>
            <div>
            <Button type="primary" onClick={() => {setVisible(true);}}>Add new set</Button>
              <CollectionCreateForm
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                  setVisible(false);
                }}
              />
            </div> 
          </Col>
        </Row> 
      </Header>
      <Content>
          <Sets />
      </Content>
  </Layout>
  );
}

export default ProxyPage;
