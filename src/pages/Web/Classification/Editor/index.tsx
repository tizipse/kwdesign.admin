import {Form, Input, InputNumber, Modal, notification, Select, Spin, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import {doCreate, doUpdate} from './service';
import Constants from '@/utils/Constants';
import {doWebClassificationByInformation} from '@/services/web';

import styles from './index.less';

const Editor: React.FC<APIWebClassification.Props> = (props) => {
  const [former] = Form.useForm<APIWebClassification.Former>();
  const [loading, setLoading] = useState<APIWebClassification.Loading>({});
  const [type, setType] = useState('basic');

  const toCreate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '添加成功'});

          if (props.onCreate) props.onCreate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const toUpdate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doUpdate(props.params?.id, params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '修改成功'});
          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const onSubmit = (values: APIWebClassification.Former) => {
    const params: APIWebClassification.Editor = {
      name: values.name,
      order: values.order,
      title: values.title,
      keyword: values.keyword,
      description: values.description,
      is_enable: values.is_enable,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onFailed = (change: any) => {
    const {values}: { values: APIWebClassification.Former } = change;

    if (!values.name || !values.is_enable || !values.order) {
      setType('basic');
    }
  };

  const toInitByUpdate = () => {
    setLoading({...loading, information: true});

    doWebClassificationByInformation(props.params?.id)
      .then((response: APIResponse.Response<APIWeb.Classification>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
          if (props.onCancel) props.onCancel();
        } else {
          const data: APIWebClassification.Former = {
            name: response.data.name,
            title: response.data.title,
            keyword: response.data.keyword,
            description: response.data.description,
            order: response.data.order,
            is_enable: response.data.is_enable,
          };

          former.setFieldsValue(data);
        }
      })
      .finally(() => setLoading({...loading, information: false}));
  };

  const toInit = () => {
    setType('basic');

    if (props.params) {
      toInitByUpdate();
    } else {
      former.setFieldsValue({
        name: undefined,
        title: undefined,
        keyword: undefined,
        description: undefined,
        order: 50,
        is_enable: 1,
      });
    }
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
    }
  }, [props.visible]);

  return (
    <Modal
      open={props.visible}
      closable={false}
      centered
      maskClosable={false}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Spin spinning={!!loading.information} tip="数据加载中...">
        <Form form={former} onFinishFailed={onFailed} onFinish={onSubmit}>
          <Tabs activeKey={type} onChange={(activeKey) => setType(activeKey)}>
            <Tabs.TabPane key="basic" tab="基本" forceRender>
              <Form.Item label="名称" name="name" rules={[{required: true}, {max: 32}]}>
                <Input/>
              </Form.Item>
              <Form.Item label="排序" name="order" rules={[{required: true}, {type: 'number'}]}>
                <InputNumber min={1} max={99} controls={false} className={styles.order}/>
              </Form.Item>
              <Form.Item label="启用" name="is_enable" rules={[{required: true}]}>
                <Select>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={2}>否</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="seo" tab="SEO" forceRender>
              <Form.Item name="title" label="标题" rules={[{max: 255}]}>
                <Input/>
              </Form.Item>
              <Form.Item name="keyword" label="词组" rules={[{max: 255}]}>
                <Input.TextArea rows={1} showCount maxLength={255}/>
              </Form.Item>
              <Form.Item name="description" label="描述" rules={[{max: 255}]}>
                <Input.TextArea rows={1} showCount maxLength={255}/>
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;
