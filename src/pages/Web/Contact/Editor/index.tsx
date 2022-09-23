import { Form, Input, InputNumber, Modal, notification, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

import styles from './index.less';

const Editor: React.FC<APIWebContact.Props> = (props) => {
  const [former] = Form.useForm<APIWebContact.Former>();
  const [loading, setLoading] = useState<APIWebContact.Loading>({});

  const toCreate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '添加成功' });

          if (props.onCreate) props.onCreate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const toUpdate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doUpdate(props.params?.id, params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '修改成功' });
          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onSubmit = (values: APIWebContact.Former) => {
    const params: APIWebContact.Editor = {
      city: values.city,
      address: values.address,
      telephone: values.telephone,
      order: values.order,
      is_enable: values.is_enable,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toInitByUpdate = () => {
    former.setFieldsValue({
      city: props.params?.city,
      address: props.params?.address,
      telephone: props.params?.telephone,
      order: props.params?.order,
      is_enable: props.params?.is_enable,
    });
  };

  const toInit = () => {
    if (!props.params) {
      former.setFieldsValue({
        city: undefined,
        address: undefined,
        telephone: undefined,
        order: 50,
        is_enable: 1,
      });
    } else {
      toInitByUpdate();
    }
  };

  useEffect(() => {
    if (props.visible) toInit();
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '修改' : '创建'}
      open={props.visible}
      closable={false}
      centered
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} onFinish={onSubmit}>
        <Form.Item label="城市" name="city" rules={[{ required: true }, { max: 32 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="地址" name="address" rules={[{ required: true }, { max: 255 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="电话" name="telephone" rules={[{ required: true }, { max: 32 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="排序" name="order" rules={[{ required: true }, { type: 'number' }]}>
          <InputNumber min={1} max={99} controls={false} className={styles.order} />
        </Form.Item>
        <Form.Item label="启用" name="is_enable" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={2}>否</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;
