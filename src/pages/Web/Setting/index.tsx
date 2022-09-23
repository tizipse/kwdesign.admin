import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, notification, Select, Spin } from 'antd';
import { doInformation, doSave } from './service';
import Constants from '@/utils/Constants';
import { useModel } from '@@/plugin-model/useModel';

const System: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [former] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [data, setData] = useState<APIWebSetting.Data[]>([]);
  const [change, setChange] = useState(false);

  const toInformation = () => {
    setLoad(true);
    doInformation()
      .then((response: APIResponse.Response<APIWebSetting.Data[]>) => {
        if (response.code === Constants.Success) {
          setData(response.data);

          const children: any = {};
          // @ts-ignore
          response.data?.map((item) => (children[item.key] = item.val));

          former.setFieldsValue(children);
        }
      })
      .finally(() => setLoad(false));
  };

  // const toHandler = () => {
  //   const temp = systems.find((item) => item.type == active);
  //   if (temp && temp.children) {
  //     setSystem(temp);
  //     const data: any = {};
  //     temp.children.forEach((item) => {
  //       if (item.key) data[item.key] = item.val;
  //     });
  //     if (data) former.setFieldsValue(data);
  //   }
  // };

  const onSubmit = (values: any) => {
    setLoad(true);
    doSave(values)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '修改成功' });
          setChange(false);
          toInformation();
        }
      })
      .finally(() => setLoad(false));
  };

  useEffect(() => {
    toInformation();
  }, []);

  return (
    <Card title="系统设置">
      <Spin spinning={load}>
        <Form
          form={former}
          labelCol={{ span: 2 }}
          disabled={
            !initialState?.permissions || initialState?.permissions?.indexOf('web.setting.save') < 0
          }
          onFinish={onSubmit}
          onValuesChange={() => setChange(true)}
        >
          {data?.map((item) => (
            <Form.Item
              name={item.key}
              key={item.id}
              label={item.label}
              rules={[
                { required: item.required === 1 },
                {
                  type:
                    item.type === 'url'
                      ? 'url'
                      : item.type == 'email'
                      ? 'email'
                      : item.type == 'enable'
                      ? 'number'
                      : 'string',
                },
              ]}
            >
              {item.type === 'input' || item.type == 'url' || item.type === 'email' ? (
                <Input />
              ) : item.type === 'textarea' ? (
                <Input.TextArea rows={3} />
              ) : item.type === 'enable' ? (
                <Select>
                  <Select.Option value={0}>否</Select.Option>
                  <Select.Option value={1}>是</Select.Option>
                </Select>
              ) : (
                <></>
              )}
            </Form.Item>
          ))}
          {change && (
            <Form.Item wrapperCol={{ offset: 2 }}>
              <Button type="primary" htmlType="submit" loading={load} block>
                修改
              </Button>
            </Form.Item>
          )}
        </Form>
      </Spin>
    </Card>
  );
};

export default System;
