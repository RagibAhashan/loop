import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Divider } from 'antd';
import { MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons';

const ProxyPage = () => {

  const [proxies, setProxies] = useState(new Map()); // name -> proxies
  const [keys, setKeys] = useState(new Map()); // key -> name


  useEffect(() => {
    console.log('useEffect was called')
  }, []);

  const onFinish = (values: any) => {
    for(let i = 0; i < values.proxies.length; i++) {
      setProxies(proxies.set(values.proxies[i].name, values.proxies[i].proxy.split(" ")));
      setKeys(keys.set(i, values.proxies[i].name));
    }
    console.log(proxies);
  };

  return (
    <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
    <Row>
      <Col span={5} style={{ marginRight: 10 }}>  <Divider> Sets            </Divider>  </Col>
      <Col span={12} style={{ marginRight: 10}}>  <Divider> Proxies         </Divider>  </Col>
      <Col span={5} style={{ marginRight: 10}}>   <Divider> No. of Proxies  </Divider>  </Col>
      <Col span={2} style={{ marginRight: 10}}>   </Col>
    </Row>
    <Form.List name="proxies">
      {(fields, { add, remove }) => (
        <>
          {fields.map(field => (
              <Row>
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
                  <MinusCircleTwoTone style={{marginTop:10}} onClick={()=> {remove(field.name); var form = document.getElementById("form"); form?.dispatchEvent(new Event('submit'))}} />
                </Col>
          </Row>))}
          <Row>
            <Col span={18}>
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Add Set
              </Button>
            </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item>
              <Button onClick={()=> {console.log(proxies.get(keys.get(0))+ '+' + proxies.size)}} disabled={fields.length === 0} type="primary" htmlType="submit" style={{float: 'right', marginRight:60}}>
                Comfirm Sets
              </Button>
            </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </Form.List>
  </Form>
  );
}

export default ProxyPage;
