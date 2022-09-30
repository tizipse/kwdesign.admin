import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Image,
  notification,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import Editor from '@/pages/Web/Project/Editor';
import { doDelete, doEnable, doPaginate } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Authorize';
import Enable from '@/components/Enable';
import { Themes } from '@/objects/Web/basic';
import moment from 'moment';

import styles from './index.less';

const Paginate: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [search, setSearch] = useState<APIWebProjects.Search>({});
  const [editor, setEditor] = useState<APIWebProjects.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APIWebProjects.Visible>({});
  const [paginate, setPaginate] = useState<APIData.Paginate>({});
  const [data, setData] = useState<APIWebProjects.Data[]>();

  const toPaginate = () => {
    setLoad(true);
    doPaginate(search)
      .then((response: APIResponse.Paginate<APIWebProjects.Data[]>) => {
        if (response.code === Constants.Success) {
          setData(response.data.data);
          setPaginate({
            page: response.data.page,
            total: response.data.total,
            size: response.data.size,
          });
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIWebProjects.Data) => {
    if (data) {
      const temp: APIWebProjects.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIWebProjects.Data) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIWebProjects.Data[] = [...data];
          Loop.ById(temp, record.id, (item: APIWebProjects.Data) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onEnable = (record: APIWebProjects.Data) => {
    if (data) {
      const temp: APIWebProjects.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIWebProjects.Data) => (item.loading_enable = true));
      setData(temp);
    }

    const enable: APIWebProjects.Enable = {
      id: record.id,
      is_enable: record.is_enable === 1 ? 2 : 1,
    };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({
            message: `${enable.is_enable === 1 ? '启用' : '禁用'}成功！`,
          });
          if (data) {
            const temp = [...data];
            Loop.ById(
              temp,
              record.id,
              (item: APIWebProjects.Data) => (item.is_enable = enable.is_enable),
            );
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(temp, record.id, (item: APIWebProjects.Data) => (item.loading_enable = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIWebProjects.Data) => {
    setEditor(record);
    setVisible({ ...visible, editor: true });
  };

  const onSuccess = () => {
    setVisible({ ...visible, editor: false });
    toPaginate();
  };

  const onCancel = () => {
    setVisible({ ...visible, editor: false });
  };

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        title="项目列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toPaginate} loading={load} />
            </Tooltip>
            <Authorize permission="web.project.create">
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Authorize>
          </Space>
        }
      >
        <Table
          dataSource={data}
          rowKey="id"
          loading={load}
          pagination={{
            total: paginate.total,
            pageSize: paginate.size,
            current: paginate.page,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="分类"
            align="center"
            render={(record: APIWebProjects.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.classification}</Tag>
            )}
          />
          <Table.Column
            title="主题"
            align="center"
            render={(record: APIWebProjects.Data) => (
              <Tag color={record.theme && Themes[record.theme] ? Themes[record.theme].color : ''}>
                {record.theme && Themes[record.theme] ? Themes[record.theme].label : ''}
              </Tag>
            )}
          />
          <Table.Column
            title="日期"
            align="center"
            render={(record: APIWebProjects.Data) =>
              record.dated_at && moment(record.dated_at).format('YYYY-MM-DD')
            }
          />
          <Table.Column
            title="地点"
            align="center"
            render={(record: APIWebProjects.Data) =>
              record.address && (
                <Tag color={initialState?.settings?.primaryColor}>{record.address}</Tag>
              )
            }
          />
          <Table.Column
            title="封面"
            align="center"
            render={(record: APIWebProjects.Data) =>
              record.picture && (
                <Image height={50} src={record.picture} className={styles.picture} />
              )
            }
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIWebProjects.Data) => (
              <Authorize
                permission="web.project.enable"
                fallback={<Enable is_enable={record.is_enable} />}
              >
                <Switch
                  size="small"
                  checked={record.is_enable === 1}
                  onClick={() => onEnable(record)}
                  loading={record.loading_enable}
                />
              </Authorize>
            )}
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIWebProjects.Data) => (
              <>
                <Authorize permission="web.project.create">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="web.project.delete">
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
      {visible.editor != undefined && (
        <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel} />
      )}
    </>
  );
};

export default Paginate;
