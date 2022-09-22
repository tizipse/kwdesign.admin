import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, notification, Spin, Upload} from 'antd';
import {useModel} from '@@/plugin-model/useModel';
import Constants from '@/utils/Constants';
import {UploadOutlined} from '@ant-design/icons';
import Pattern from '@/utils/Pattern';
import {doUpdate} from './service';

import styles from './index.less';

const Account: React.FC = () => {

  const {initialState, setInitialState} = useModel('@@initialState');

  const [former] = Form.useForm<APIAccount.Former>();
  const [loading, setLoading] = useState<APIAccount.Loading>({});
  const [change, setChange] = useState(false);

  const pictures = Form.useWatch('pictures', former);

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

  const onSave = async (params: APIAccount.Editor) => {
    setLoading({...loading, confirm: true});
    doUpdate(params)
      .then(async (response: APIResponse.Response<any>) => {
        if (response.code != Constants.Success) {
          notification.error({message: response.message});
        } else {
          setChange(false);
          notification.success({message: '修改成功'});

          const userInfo = await initialState?.toAccount?.();

          if (userInfo) {
            await setInitialState((s) => ({...s, account: userInfo}));
          }
        }
      })
      .finally(() => setLoading({...loading, confirm: false}));
  };

  const onSubmit = async (values: APIAccount.Former) => {

    const params: APIAccount.Editor = {
      nickname: values.nickname,
      mobile: values.mobile,
      email: values.email,
      password: values.password,
      signature: values.signature,
    };


    if (values.pictures && values.pictures.length > 0) {
      params.avatar = values.pictures[0].thumbUrl
    }

    await onSave(params);
  };

  useEffect(() => {
    if (initialState?.account) {
      const data: APIAccount.Former = {
        pictures: undefined,
        username: initialState.account.username,
        nickname: initialState.account.nickname,
        mobile: initialState.account.mobile,
        email: initialState.account.email,
        signature: initialState.account.signature,
      };
      if (initialState.account.avatar) {
        data.pictures = [{key: 1, thumbUrl: initialState.account.avatar}]
      }
      former.setFieldsValue(data);
    }
  }, [initialState?.account]);

  return (
    <Card title='个人中心'>
      <Form form={former}
            labelCol={{sm: 4, md: 3, lg: 2}} wrapperCol={{lg: 12}}
            onValuesChange={() => setChange(true)} onFinish={onSubmit}
      >
        <Form.Item label='头像' name='pictures' valuePropName='fileList' getValueFromEvent={onUpload}
                   rules={[{required: true}]}>
          <Upload
            name='file'
            listType='picture-card'
            showUploadList={false}
            maxCount={1}
            action={Constants.Upload}
            headers={{Authorization: localStorage.getItem(Constants.Authorization) as string}}
            data={{dir: '/avatar'}}
            onChange={onUpload}>
            <Spin spinning={!!loading.upload}>
              {
                pictures && pictures?.length > 0 ?
                  <img src={pictures[0].thumbUrl} alt={initialState?.account?.nickname}
                       className={styles.uploadImage}/> :
                  <div className={styles.upload}>
                    <UploadOutlined className='upload-icon'/>
                  </div>
              }
            </Spin>
          </Upload>
        </Form.Item>
        <Form.Item name='nickname' label='昵称' rules={[{required: true}, {max: 20}]}>
          <Input/>
        </Form.Item>
        <Form.Item name='mobile' label='手机号'
                   rules={[{required: true}, {max: 20}, {pattern: RegExp(Pattern.MOBILE), message: '手机号输入错误'}]}>
          <Input/>
        </Form.Item>
        <Form.Item name='email' label='邮箱' rules={[{max: 60}, {type: 'email'}]}>
          <Input/>
        </Form.Item>
        <Form.Item name='password' label='密码'
                   rules={[{pattern: RegExp(Pattern.ADMIN_PASSWORD)}]}>
          <Input.Password/>
        </Form.Item>
        <Form.Item name='signature' label='签名'
                   rules={[{max: 255}]}>
          <Input.TextArea rows={2} maxLength={255} showCount/>
        </Form.Item>
        {
          change ?
            <Form.Item
              wrapperCol={{sm: {span: 20, offset: 4}, md: {span: 21, offset: 3}, lg: {span: 12, offset: 2}}}>
              <Button type='primary' htmlType='submit' block>修改</Button>
            </Form.Item> : <></>
        }
      </Form>
    </Card>
  );
};

export default Account;
