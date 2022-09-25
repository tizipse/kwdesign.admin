import {Button, Form, Input, Modal, notification, Select, Space, Spin, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {InboxOutlined} from '@ant-design/icons';
import {doCreate, doUpdate} from './service';
import Constants from '@/utils/Constants';

import styles from './index.less';

const Editor: React.FC<APIWebPicture.Props> = (props) => {

  const [former] = Form.useForm<APIWebPicture.Former>();
  const [loading, setLoading] = useState<APIWebPicture.Loading>({});

  const val = Form.useWatch('val', former)

  const onUpload = (e: any) => {

    if (Array.isArray(e)) return e;

    if (e.file.status == 'uploading' && e.file.percent == 0) {

      setLoading({...loading, upload: true})

    } else if (e.file.status == 'done') {

      setLoading({...loading, upload: false})

      const {uid, response}: { uid: string; response: APIResponse.Response<API.Upload> } = e.file;

      if (response.code !== Constants.Success) {
        notification.error({message: response.message});
      } else {
        e.fileList?.forEach((item: any) => {
          if (item.uid == uid) item.thumbUrl = response.data.url;
        });
      }
    }

    return e && e.fileList;
  };

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

  const onSubmit = (values: APIWebPicture.Former) => {

    const params: APIWebPicture.Editor = {
      label: values.label,
      key: values.key,
      required: values.required,
    };

    if (values.val && values.val.length > 0) {
      params.val = values.val[0].thumbUrl
    }

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onRemovePicture = () => {
    former.setFieldsValue({val: undefined})
  }

  const toInit = () => {

    const data: APIWebPicture.Former = {
      label: undefined,
      key: undefined,
      val: undefined,
      required: 1,
    }

    if (props.params) {
      data.label = props.params.label

      if (props.params.val) {
        data.val = [{key: props.params?.id, thumbUrl: props.params?.val}]
      }
    }

    former.setFieldsValue(data)
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
      maskClosable={false}
      footer={
        <Space size={[10, 10]}>
          {
            !!props.params && props.params.val &&
            <Button danger onClick={onRemovePicture}>删除图片</Button>
          }
          <Button onClick={props.onCancel}>取消</Button>
          <Button type='primary' onClick={former.submit} loading={loading.confirmed}>确定</Button>
        </Space>
      }
    >
      <Form form={former} onFinish={onSubmit} labelCol={{span: 3}}>
        <Form.Item label="名称" name="label" rules={[{required: true}, {max: 32}]}>
          <Input/>
        </Form.Item>
        {
          !props.params &&
          <Form.Item label="代码" name="key" rules={[{required: true}, {max: 32}]}>
            <Input/>
          </Form.Item>
        }
        <Form.Item label='图片' name='val' valuePropName='fileList' getValueFromEvent={onUpload}
                   rules={[{required: !props.params}]}>
          <Upload
            name="file"
            listType="picture-card"
            className={styles.upload}
            showUploadList={false}
            maxCount={1}
            action={Constants.Upload}
            headers={{Authorization: localStorage.getItem(Constants.Authorization) as string}}
            data={{dir: '/picture'}}
          >
            <Spin spinning={!!loading.upload} tip="Loading...">
              {
                val && val.length > 0 ? (
                  <img src={val[0].thumbUrl} alt="avatar" style={{width: '100%'}}/>
                ) : (
                  <div className="upload-area">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="upload-icon"/>
                    </p>
                    <p className="ant-upload-text">点击进行上传</p>
                    <p className="ant-upload-hint">Support for a single upload.</p>
                  </div>
                )}
            </Spin>
          </Upload>
        </Form.Item>
        {
          !props.params &&
          <Form.Item label="必填" name="required" rules={[{required: true}]}>
            <Select>
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={2}>否</Select.Option>
            </Select>
          </Form.Item>
        }
      </Form>
    </Modal>
  );
};

export default Editor;
