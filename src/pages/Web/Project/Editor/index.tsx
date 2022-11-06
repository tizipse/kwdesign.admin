import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Select,
  Spin,
  Tabs,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doUpdate } from './service';
import { doUpload } from '@/services/helper';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { InboxOutlined, PlusOutlined } from '@ant-design/icons';
import { doWebClassificationByEnable, doWebProjectByInformation } from '@/services/web';
import BraftEditor from 'braft-editor';
// @ts-ignore
import ColorPicker from 'braft-extensions/dist/color-picker';
// @ts-ignore
import Table from 'braft-extensions/dist/table';

BraftEditor.use(ColorPicker({ theme: 'dark' }));
BraftEditor.use(Table({ columnResizable: true }));

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';

import styles from './index.less';

const Editor: React.FC<APIWebProject.Props> = (props) => {
  const [former] = Form.useForm<APIWebProject.Former>();
  const [loading, setLoading] = useState<APIWebProject.Loading>({});
  const [type, setType] = useState('basic');
  const [classifications, setClassifications] = useState<APIWeb.ClassificationByEnable[]>([]);

  const picture = Form.useWatch('picture', former);
  const pictures = Form.useWatch('pictures', former);

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

  const onUploadByEditor = (param: any) => {
    doUpload(param.file, '/project/content').then((response: APIResponse.Response<API.Upload>) => {
      param.progress(100);
      if (response.code !== Constants.Success) {
        param.error({ msg: response.message });
      } else {
        param.success({ url: response.data.url, meta: { alt: response.data.name } });
      }
    });
  };

  const toClassifications = () => {
    setLoading({ ...loading, classification: true });
    doWebClassificationByEnable()
      .then((response: APIResponse.Response<APIWeb.ClassificationByEnable[]>) => {
        setClassifications(response.data);
      })
      .finally(() => setLoading({ ...loading, classification: false }));
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

  const onSubmit = (values: APIWebProject.Former) => {
    const params: APIWebProject.Editor = {
      classification: values.classification,
      theme: values.theme,
      name: values.name,
      address: values.address,
      height: values.height,
      title: values.title,
      keyword: values.keyword,
      description: values.description,
      pictures: [],
      is_enable: values.is_enable,
      html: values.content.toHTML(),
    };

    if (values.picture && values.picture.length > 0) {
      params.picture = values.picture[0].thumbUrl;
    }

    if (values.pictures && values.pictures.length > 0) {
      values.pictures.forEach((item) => params.pictures?.push(item.thumbUrl));
    }

    if (values.date && moment.isMoment(values.date)) {
      params.date = values.date.format('YYYY-MM-DD');
    }

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onFailed = (change: any) => {
    const { values }: { values: APIWebProject.Former } = change;

    if (!values.name || !values.classification || !values.height || !values.is_enable) {
      setType('basic');
    } else if (!values.picture || values.picture.length <= 0) {
      setType('picture');
    } else if (!values.content) {
      setType('content');
    } else if (!values.pictures || values.pictures.length <= 0) {
      setType('pictures');
    }
  };

  const toInitByUpdate = () => {
    setLoading({ ...loading, information: true });

    doWebProjectByInformation(props.params?.id)
      .then((response: APIResponse.Response<APIWeb.Project>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
          if (props.onCancel) props.onCancel();
        } else {
          const data: APIWebProject.Former = {
            classification: response.data.classification,
            theme: response.data.theme,
            name: response.data.name,
            address: response.data.address,
            height: response.data.height,
            title: response.data.title,
            keyword: response.data.keyword,
            description: response.data.description,
            picture: undefined,
            pictures: undefined,
            is_enable: response.data.is_enable,
            content: BraftEditor.createEditorState(response.data.html),
          };

          if (response.data.dated_at) {
            data.date = moment(response.data.dated_at);
          }

          if (response.data.picture) {
            data.picture = [{ key: response.data.id, thumbUrl: response.data.picture }];
          }

          if (response.data.pictures) {
            data.pictures = [];
            response.data.pictures.forEach((item, index) =>
              data.pictures?.push({ key: index, thumbUrl: item }),
            );
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
        classification: undefined,
        theme: 'light',
        name: undefined,
        address: undefined,
        height: 75,
        date: undefined,
        title: undefined,
        keyword: undefined,
        description: undefined,
        picture: undefined,
        pictures: undefined,
        is_enable: 1,
        content: BraftEditor.createEditorState(null),
      });
    }
  };

  useEffect(() => {
    if (props.visible) {
      toInit();

      if (classifications.length <= 0) toClassifications();
    }
  }, [props.visible]);

  return (
    <Modal
      width={660}
      open={props.visible}
      closable={false}
      centered
      maskClosable={false}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Spin spinning={!!loading.information} tip="数据加载中...">
        <Form form={former} onFinishFailed={onFailed} onFinish={onSubmit} labelCol={{ span: 3 }}>
          <Tabs activeKey={type} onChange={(activeKey) => setType(activeKey)}>
            <Tabs.TabPane key="basic" tab="基本" forceRender>
              <Form.Item label="主题" name="theme" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="light">明亮</Select.Option>
                  <Select.Option value="dark">黑暗</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="分类" name="classification" rules={[{ required: true }]}>
                <Select>
                  {classifications.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 32 }]}>
                <Input />
              </Form.Item>
              <Form.Item label="地点" name="address" rules={[{ required: true }, { max: 64 }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="高度"
                name="height"
                rules={[{ required: true }, { type: 'number', min: 1, max: 100 }]}
              >
                <InputNumber
                  controls={false}
                  addonAfter="%"
                  placeholder="75%"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label="日期" name="date">
                <DatePicker allowClear />
              </Form.Item>
              <Form.Item label="启用" name="is_enable" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={2}>否</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="seo" tab="SEO" forceRender>
              <Form.Item name="title" label="标题" rules={[{ max: 255 }]}>
                <Input />
              </Form.Item>
              <Form.Item name="keyword" label="词组" rules={[{ max: 255 }]}>
                <Input.TextArea rows={3} showCount maxLength={255} />
              </Form.Item>
              <Form.Item name="description" label="描述" rules={[{ max: 255 }]}>
                <Input.TextArea rows={3} showCount maxLength={255} />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="picture" tab="封面" forceRender>
              <Form.Item
                name="picture"
                valuePropName="fileList"
                getValueFromEvent={onUpload}
                rules={[{ required: true, message: '封面不能为空' }]}
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
                  data={{ dir: '/project/picture' }}
                  onRemove={() => console.info('remove')}
                >
                  <Spin spinning={!!loading.upload} tip="上传中...">
                    {picture && picture.length > 0 ? (
                      <img src={picture[0].thumbUrl} alt={props.params?.name} />
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
            <Tabs.TabPane key="content" tab="内容" forceRender>
              <Form.Item
                name="content"
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
            <Tabs.TabPane key="pictures" tab="图片" forceRender>
              <Form.Item name="pictures" valuePropName="fileList" getValueFromEvent={onUpload}>
                <Upload
                  name="file"
                  listType="picture-card"
                  maxCount={16}
                  beforeUpload={(file) => {
                    const size = file.size / 1024 / 1024 <= 2;
                    if (!size) message.error('图片大小必须小于 2M');
                    return size;
                  }}
                  action={Constants.Upload}
                  headers={{
                    Authorization: localStorage.getItem(Constants.Authorization) as string,
                  }}
                  data={{ dir: '/project/pictures' }}
                >
                  {(!pictures || pictures.length < 16) && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;
