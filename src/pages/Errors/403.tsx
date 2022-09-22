import React from 'react';
import {Button, Result} from 'antd';
import {history} from 'umi';

const UnAccessible: React.FC = () => (
  <Result
    status='403'
    title='403'
    subTitle='对不起，您没有权限访问该页面.'
    extra={
      <Button type='primary' onClick={() => history.push('/')}>回到首页</Button>
    }
  />
);

export default UnAccessible;
