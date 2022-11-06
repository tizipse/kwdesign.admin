import { Form, Input, message, Modal, notification, Select, Spin, Tabs, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import { doUpload } from '@/services/helper';
import { doWebCategoryByInformation } from '@/services/web';
import Constants from '@/utils/Constants';
import { InboxOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
// @ts-ignore
import ColorPicker from 'braft-extensions/dist/color-picker';
// @ts-ignore
import Table from 'braft-extensions/dist/table';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';

import styles from './index.less';

BraftEditor.use(ColorPicker({ theme: 'dark' }));
BraftEditor.use(Table({ columnResizable: true }));

const Editor: React.FC<APIWebCategory.Props> = (props) => {
  const [former] = Form.useForm<APIWebCategory.Former>();
  const [loading, setLoading] = useState<APIWebCategory.Loading>({});
  const [type, setType] = useState('basic');

  const pictures = Form.useWatch('pictures', former);
  const is_required_picture = Form.useWatch('is_required_picture', former);
  const is_required_html = Form.useWatch('is_required_html', former);

  const onUpload = (e: any) => {
    if (Array.isArray(e)) return e;

    if (e.file.status == 'uploading' && e.file.percent == 0) {
      setLoading({ ...loading, upload: true });
    } else if (e.file.status == 'done') {
      setLoading({ ...loading, upload: false });

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

  const onUploadByEditor = (param: any) => {
    doUpload(param.file, '/category/content').then((response: APIResponse.Response<API.Upload>) => {
      param.progress(100);
      if (response.code !== Constants.Success) {
        param.error({ msg: response.message });
      } else {
        param.success({ url: response.data.url, meta: { alt: response.data.name } });
      }
    });
  };

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

  const onSubmit = (values: APIWebCategory.Former) => {
    const params: APIWebCategory.Editor = {
      uri: values.uri,
      name: values.name,
      title: values.title,
      keyword: values.keyword,
      description: values.description,
      is_enable: values.is_enable,
      is_required_picture: values.is_required_picture,
      is_required_html: values.is_required_html,
    };

    if (values.pictures && values.pictures.length > 0) {
      params.picture = values.pictures[0].thumbUrl;
    }

    if (values.html) params.html = values.html.toHTML();

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onFailed = (change: any) => {
    const { values }: { values: APIWebCategory.Former } = change;

    if (!values.name || !values.uri) {
      setType('basic');
    } else if (is_required_picture == 1 && (!values.pictures || values.pictures.length <= 0)) {
      setType('picture');
    } else if (is_required_html == 1 && !values.html) {
      setType('html');
    }
  };

  const toInitByUpdate = () => {
    setLoading({ ...loading, information: true });

    doWebCategoryByInformation(props.params?.id)
      .then((response: APIResponse.Response<APIWeb.Category>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
          if (props.onCancel) props.onCancel();
        } else {
          const data: APIWebCategory.Former = {
            name: response.data.name,
            title: response.data.title,
            keyword: response.data.keyword,
            description: response.data.description,
            uri: response.data.uri,
            pictures: undefined,
            is_enable: response.data.is_enable,
            is_required_picture: response.data.is_required_picture,
            is_required_html: response.data.is_required_html,
            html: BraftEditor.createEditorState(response.data.html),
          };

          if (response.data.picture) {
            data.pictures = [{ key: response.data.id, thumbUrl: response.data.picture }];
          }

          former.setFieldsValue(data);
        }
      })
      .finally(() => setLoading({ ...loading, information: false }));
  };

  const toInit = () => {
    setType('basic');

    if (props.params) {
      toInitByUpdate();
    } else {
      former.setFieldsValue({
        uri: undefined,
        name: undefined,
        title: undefined,
        keyword: undefined,
        description: undefined,
        pictures: undefined,
        is_enable: 1,
        is_required_picture: 2,
        is_required_html: 2,
        html: BraftEditor.createEditorState(null),
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
      width={660}
      open={props.visible}
      closable={false}
      centered
      maskClosable={false}
      confirmLoading={loading.confirmed}
      onCancel={props.onCancel}
      onOk={former.submit}
    >
      <Spin spinning={!!loading.information} tip="数据加载中...">
        <Form form={former} onFinishFailed={onFailed} onFinish={onSubmit} labelCol={{ span: 2 }}>
          <Tabs activeKey={type} onChange={(activeKey) => setType(activeKey)}>
            <Tabs.TabPane key="basic" tab="基本" forceRender>
              <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 32 }]}>
                <Input />
              </Form.Item>
              <Form.Item label="链接" name="uri" rules={[{ required: true }, { max: 32 }]}>
                <Input disabled={!!props.params} />
              </Form.Item>
              <Form.Item label="启用" name="is_enable" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={2}>否</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="图片" name="is_required_picture" rules={[{ required: true }]}>
                <Select disabled={!!props.params}>
                  <Select.Option value={1}>必填上传</Select.Option>
                  <Select.Option value={2}>无需上传</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="内容" name="is_required_html" rules={[{ required: true }]}>
                <Select disabled={!!props.params}>
                  <Select.Option value={1}>必填填写</Select.Option>
                  <Select.Option value={2}>无需填写</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="seo" tab="SEO" forceRender>
              <Form.Item name="title" label="标题" rules={[{ max: 255 }]}>
                <Input />
              </Form.Item>
              <Form.Item name="keyword" label="词组" rules={[{ max: 255 }]}>
                <Input.TextArea rows={2} showCount maxLength={255} />
              </Form.Item>
              <Form.Item name="description" label="描述" rules={[{ max: 255 }]}>
                <Input.TextArea rows={3} showCount maxLength={255} />
              </Form.Item>
            </Tabs.TabPane>
            {is_required_picture == 1 && (
              <Tabs.TabPane key="picture" tab="图片" forceRender>
                <Form.Item
                  name="pictures"
                  valuePropName="fileList"
                  getValueFromEvent={onUpload}
                  rules={[{ required: true, message: '图片不能为空' }]}
                >
                  <Upload
                    name="file"
                    listType="picture-card"
                    className={styles.upload}
                    showUploadList={false}
                    maxCount={1}
                    beforeUpload={(file) => {
                      const size = file.size / 1024 / 1024 <= 2;
                      if (!size) message.error('图片大小必须小于 2M');
                      return size;
                    }}
                    action={Constants.Upload}
                    headers={{
                      Authorization: localStorage.getItem(Constants.Authorization) as string,
                    }}
                    data={{ dir: '/category/banner' }}
                    onRemove={() => console.info('remove')}
                  >
                    <Spin spinning={!!loading.upload} tip="上传中...">
                      {pictures && pictures.length > 0 ? (
                        <img src={pictures[0].thumbUrl} alt={props.params?.name} />
                      ) : (
                        <div className="upload-area">
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined className="upload-icon" />
                          </p>
                          <p className="ant-upload-text">点击进行上传</p>
                          <p className="ant-upload-hint">Support for a single upload.</p>
                        </div>
                      )}
                    </Spin>
                  </Upload>
                </Form.Item>
              </Tabs.TabPane>
            )}
            {is_required_html == 1 && (
              <Tabs.TabPane key="html" tab="内容" forceRender>
                <Form.Item
                  name="html"
                  rules={[
                    {
                      required: true,
                      validator: (rule, value) => {
                        if (value.isEmpty()) {
                          return Promise.reject('请输入内容');
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <BraftEditor
                    media={{ uploadFn: onUploadByEditor }}
                    controls={Constants.Controls()}
                    className={styles.braft}
                  />
                </Form.Item>
              </Tabs.TabPane>
            )}
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;
