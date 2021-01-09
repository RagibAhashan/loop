import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Divider, Popover, Space, Card, message } from 'antd';
import { MinusCircleTwoTone, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Constants from '../constants';

const ProxyPage = (props: any) => {
  const { setPage } = props;
  const [proxies, setProxies] = useState(new Map<string, []>()); // name -> proxies
  const [keys, setKeys] = useState(new Map<number, string>()); // key -> name


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
      setKeys(keys.set(i, values.proxies[i].name));
    }

    localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())));
    setPage(Constants.BILLING)
    setPage(Constants.PROXIES)
  };

  const onDeleteSet = (name: any) => {
    console.log(name)
    proxies.delete(name.toString());
    setProxies(proxies);
    localStorage.setItem('proxies', JSON.stringify(Array.from(proxies.entries())))
    setPage(Constants.BILLING)
    setTimeout(() => {
        setPage(Constants.PROXIES)
    }, 0.2)
  }

  const content = (values: any, name: any) => (
    <div>
      <Row>
        <Col>
            <Divider> Name </Divider>
            <p> {name} </p>
        </Col>
      </Row>
      <Row>
        <Col>
            <Divider> Proxies </Divider>
            {(values.join("<\n>"))}
        </Col>
      </Row>
      <Row>
        <Col>
            <Divider> No. of Proxies </Divider>
            <p> {values.length} </p>
        </Col>
      </Row>
    </div>
  );

  const ShowProxies = (proxies: Map<string, []>) => {
    let proxyArray = Array.from(proxies, ([name, proxies]) => ({ name, proxies }));
    if (!proxies.size) return (<h1> No Sets Found. </h1>)
    return proxyArray.map( (value) => {
      const ex = proxies.get(value.name) as Array<string>;
      return (
        <Popover content={content(value.proxies, value.name)} placement="right">
            <Card size="small"
                title={value.name}
                extra={
                    <Button type="link" danger icon={<DeleteOutlined />}
                        onClick={() => onDeleteSet(value.name)}
                    />
                }
                style={{ width: 200, height: 140, margin: 3 }}
            >
                <p> {`Example: ${ex[0]}...`} </p>
                <p> {`No. of Proxies: ${ex.length}`} </p>

            </Card>
        </Popover>
      )
    })
}

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
    <Row>
     <Col span={22} style={{marginLeft: 10}}> <Divider> My Sets </Divider> </Col>
      {ShowProxies(proxies)}
    </Row>
    <Row>
      <Col span={5}   style={{ marginRight: 10 }}>  <Divider> Set Name        </Divider>  </Col>
      <Col span={12}  style={{ marginRight: 10}}>   <Divider> Proxies         </Divider>  </Col>
      <Col span={5}   style={{ marginRight: 10}}>   <Divider> No. of Proxies  </Divider>  </Col>
      <Col span={2}   style={{ marginRight: 10}}>   </Col>
    </Row>
    <Form.List name="proxies">
      {(fields, { add, remove }) => (
        <>
          {fields.map(field => (
              <Row  key={field.key}>
                <Col span={5} style={{marginRight: 10}}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'name']}
                    fieldKey={[field.fieldKey, 'name']}
                    style={{ width: 'auto'}}
                    rules={[{ required: true, message: 'Missing set name' }]}
                  >
                    <Input   placeholder="Set Name" />
                  </Form.Item>
                </Col>
                <Col span={12} style={{marginRight: 10}}>
                  <Form.Item
                    {...field}
                    name={[field.name, 'proxy']}
                    fieldKey={[field.fieldKey, 'proxy']}
                    style={{ width: 'auto'}}
                    rules={[{ required: true, message: 'Missing proxies' }]}
                  >
                    <Input style={{display: 'flex' }} placeholder="Copy Paste your list of proxies" />
                  </Form.Item>
                </Col>
                <Col span={5} style={{marginRight: 10}}>
                  {/* value={proxies.size? proxies.get(keys.get(field.fieldKey)).length : 0} */}
                    <Input  style={{ display: 'flex', textAlign: 'center' }} value={0} disabled={true} />
                </Col>
                <Col span={1}>
                  <MinusCircleTwoTone style={{marginTop:10}} onClick={()=> {remove(field.name);}} />
                </Col>
          </Row>))}
          <Row>
            <Col span={5}  style={{marginRight: 10}}>
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                New Set
              </Button>
            </Form.Item>
            </Col>
            <Col span={12} style={{marginRight: 10}}> </Col>

            <Col span={5} >
            <Form.Item>
              <Button style={{float:'right'}} onClick={()=> {}} disabled={fields.length === 0} type="primary" htmlType="submit">
                Comfirm Sets
              </Button>
            </Form.Item>
            </Col>
            <Col span={1}></Col>
          </Row>
        </>
      )}
    </Form.List>
  </Form>
  );
}

export default ProxyPage;
