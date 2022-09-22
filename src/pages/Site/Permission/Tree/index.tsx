import React, {useEffect, useState} from 'react';
import {Button, Card, notification, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography} from 'antd';
import Constants from '@/utils/Constants';
import {FormOutlined, RedoOutlined} from '@ant-design/icons';
import {useModel} from '@@/plugin-model/useModel';
import Editor from '@/pages/Site/Permission/Editor';
import {doSiteModuleByEnable} from '@/services/site';
import {doDelete, doTree} from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Authorize';

import styles from './index.less';

const methods = {
  GET: '#87d068',
  POST: '#2db7f5',
  PUT: '#6F2CF2',
  DELETE: '#f50',
};

const Tree: React.FC = () => {

  const {initialState} = useModel('@@initialState');

  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState<APISitePermissions.Loading>({});
  const [search, setSearch] = useState<APISitePermissions.Search>({});
  const [editor, setEditor] = useState<APISitePermissions.Data | undefined>();
  const [visible, setVisible] = useState<APISitePermissions.Visible>({});
  const [modules, setModules] = useState<APISite.Module[]>([]);
  const [data, setData] = useState<APISitePermissions.Data[]>();

  const toModules = () => {
    setLoading({...loading, module: true});
    doSiteModuleByEnable()
      .then((response: APIResponse.Response<any[]>) => {
        if (response.code === Constants.Success) {
          setModules(response.data);
          if (response.data.length > 0) setSearch({...search, module: response.data[0].id});
        }
      })
      .finally(() => setLoading({...loading, module: false}));
  };

  const toPaginate = () => {
    setLoad(true);
    doTree(search)
      .then((response: APIResponse.Response<APISitePermissions.Data[]>) => {
        if (response.code === Constants.Success) {
          setData(response.data);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APISitePermissions.Data) => {

    if (data) {
      let temp: APISitePermissions.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APISitePermissions.Data) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '权限删除成功！'});
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          let temp = [...data];
          Loop.ById(temp, record.id, (item: APISitePermissions.Data) => (item.loading_deleted = false),);
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({...visible, editor: true});
  };

  const onUpdate = (record: APISitePermissions.Data) => {
    setEditor(record);
    setVisible({...visible, editor: true});
  };

  const onSuccess = () => {
    setVisible({...visible, editor: false});
    toPaginate();
  };

  const onCancel = () => {
    setVisible({...visible, editor: false});
  };

  useEffect(() => {
    if (search.module) toPaginate();
  }, [search.module]);

  useEffect(() => {
    if (modules.length <= 0) toModules();
  }, []);

  return (
    <>
      <Card
        title="权限列表"
        extra={
          <Space size={[10, 10]}>
            <Select value={search?.module} placeholder="模块"
                    onChange={(value: number) => setSearch({...search, module: value})}
            >
              {
                modules.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))
              }
            </Select>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined/>} onClick={toPaginate} loading={load}/>
            </Tooltip>
            <Authorize permission="site.permission.create">
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined/>} onClick={onCreate}/>
              </Tooltip>
            </Authorize>
          </Space>
        }
      >
        <Table dataSource={data} rowKey="id" size="small" loading={load} pagination={false}>
          <Table.Column title="名称" dataIndex="name"/>
          <Table.Column
            title="标识"
            render={(record: APISitePermissions.Data) => (
              <Typography.Text copyable>{record.slug}</Typography.Text>
            )}
          />
          <Table.Column
            title="接口"
            render={(record: APISitePermissions.Data) => (
              <>
                <Tag color={record.method && methods ? methods[record.method] : '#2db7f5'}>
                  {record.method?.toUpperCase()}
                </Tag>
                <Tag
                  className={styles.path}
                  style={{color: initialState?.settings?.primaryColor}}
                >
                  {record.path}
                </Tag>
              </>
            )}
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APISitePermissions.Data) => (
              <>
                <Authorize permission="site.permission.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="site.permission.delete">
                  <Popconfirm
                    title="确定要删除该数据?"
                    placement="leftTop"
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type="link" danger loading={record.loading_deleted}>
                      删除
                    </Button>
                  </Popconfirm>
                </Authorize>
              </>
            )}
          />
        </Table>
      </Card>
      {
        visible.editor !== undefined &&
        <Editor visible={visible.editor} params={editor} methods={methods} module={search.module}
                onSave={onSuccess} onCancel={onCancel}/>
      }
    </>
  );
};

export default Tree;
