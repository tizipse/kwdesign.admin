import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Modal, notification, Select, Spin, Upload } from 'antd';
import { doInformation, doSave } from './service';
import Constants from '@/utils/Constants';
import { useModel } from '@@/plugin-model/useModel';
import { PlusOutlined } from '@ant-design/icons';

const System: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [former] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [data, setData] = useState<APIWebSetting.Data[]>([]);
  const [change, setChange] = useState(false);
  const [pictures, setPictures] = useState<object>({});
  const [preview, setPreview] = useState<APIWebSetting.Preview>({});

  const onUpload = (e: any) => {
    if (Array.isArray(e)) return e;

    if (e.file.status == 'done') {
      const { uid, response }: { uid: string; response: APIResponse.Response<API.Upload> } = e.file;

      if (response.code !== Constants.Success) {
        notification.error({ message: response.message });
      } else {
        e.fileList?.forEach((item: any) => {
          if (item.uid == uid) item.thumbUrl = response.data.url;
        });
      }
    }

    return e && e.fileList;
  };

  const toInformation = () => {
    setLoad(true);
    doInformation()
      .then((response: APIResponse.Response<APIWebSetting.Data[]>) => {
        if (response.code === Constants.Success) {
          setData(response.data);

          const temp: object = {};

          const children: any = {};

          response.data?.forEach((item) => {
            if (item.type == 'picture' && item.key) {
              children[item.key] = item.val ? [{ key: item.key, thumbUrl: item.val }] : [];
              temp[item.key] = item.val;
            } else if (item.key) {
              children[item.key] = item.val;
            }
          });

          setPictures(temp);
          former.setFieldsValue(children);
        }
      })
      .finally(() => setLoad(false));
  };

  const onSave = (params: any) => {
    setLoad(true);
    doSave(params)
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

  const onSubmit = (values: object) => {
    const params: any = {};

    for (const key in values) {
      if (Array.isArray(values[key])) {
        params[key] = values[key].length > 0 ? values[key][0]?.thumbUrl : '';
      } else {
        params[key] = values[key];
      }
    }

    onSave(params);
  };

  const onChange = (value: any) => {
    for (const key in value) {
      if (Array.isArray(value[key])) {
        const temp = { ...pictures };

        if (value[key].length > 0) {
          temp[key] = value[key][0]?.thumbUrl;
        } else {
          temp[key] = '';
        }

        setPictures(temp);
      }
    }

    setChange(true);
  };

  const onPreview = (file: any, label?: string) => {
    const { thumbUrl } = file;

    setPreview({ visible: true, title: label, picture: thumbUrl });
  };

  useEffect(() => {
    toInformation();
  }, []);

  const RenderPicture = (record: APIWebSetting.Data) => (
    <Form.Item
      name={record.key}
      key={record.id}
      label={record.label}
      valuePropName="fileList"
      getValueFromEvent={onUpload}
      rules={[{ required: record.required === 1 }]}
    >
      <Upload
        name="file"
        listType="picture-card"
        maxCount={1}
        action={Constants.Upload}
        headers={{ Authorization: localStorage.getItem(Constants.Authorization) as string }}
        data={{ dir: '/pictures' }}
        onPreview={(file) => onPreview(file, record.label)}
      >
        {record.key && !pictures[record.key] && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        )}
      </Upload>
    </Form.Item>
  );

  const RenderInput = (record: APIWebSetting.Data) => (
    <Form.Item
      name={record.key}
      key={record.id}
      label={record.label}
      rules={[{ required: record.required === 1 }]}
    >
      <Input />
    </Form.Item>
  );

  const RenderEmail = (record: APIWebSetting.Data) => (
    <Form.Item
      name={record.key}
      key={record.id}
      label={record.label}
      rules={[{ required: record.required === 1, type: 'email' }]}
    >
      <Input />
    </Form.Item>
  );

  const RenderUrl = (record: APIWebSetting.Data) => (
    <Form.Item
      name={record.key}
      key={record.id}
      label={record.label}
      rules={[{ required: record.required === 1, type: 'url' }]}
    >
      <Input />
    </Form.Item>
  );

  const RenderEnable = (record: APIWebSetting.Data) => (
    <Form.Item
      name={record.key}
      key={record.id}
      label={record.label}
      rules={[{ required: record.required === 1 }]}
    >
      <Select>
        <Select.Option value={0}>否</Select.Option>
        <Select.Option value={1}>是</Select.Option>
      </Select>
    </Form.Item>
  );

  const RenderTextarea = (record: APIWebSetting.Data) => (
    <Form.Item
      name={record.key}
      key={record.id}
      label={record.label}
      rules={[{ required: record.required === 1 }]}
    >
      <Input.TextArea />
    </Form.Item>
  );

  const Render = (record: APIWebSetting.Data) => {
    let r = <React.Fragment key={record.key} />;

    switch (record.type) {
      case 'picture':
        r = RenderPicture(record);
        break;
      case 'input':
        r = RenderInput(record);
        break;
      case 'email':
        r = RenderEmail(record);
        break;
      case 'url':
        r = RenderUrl(record);
        break;
      case 'enable':
        r = RenderEnable(record);
        break;
      case 'textarea':
        r = RenderTextarea(record);
        break;
    }

    return r;
  };

  return (
    <>
      <Card title="系统设置">
        <Spin spinning={load}>
          <Form
            form={former}
            labelCol={{ span: 5 }}
            disabled={
              !initialState?.permissions ||
              initialState?.permissions?.indexOf('web.setting.save') < 0
            }
            onFinish={onSubmit}
            onValuesChange={onChange}
          >
            {data?.map((item) => Render(item))}
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
      <Modal
        open={preview.visible}
        title={preview.title}
        centered
        footer={null}
        onCancel={() => setPreview({ visible: false })}
      >
        <img alt={preview.title} style={{ width: '100%' }} src={preview.picture} />
      </Modal>
    </>
  );
};

export default System;
