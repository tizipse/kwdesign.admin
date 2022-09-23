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
import Editor from '@/pages/Web/Category/Editor';
import { doDelete, doEnable, doList } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Authorize';
import Enable from '@/components/Enable';
import { Themes } from '@/objects/Web/category';

const Tree: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIWebCategories.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APIWebCategories.Visible>({});
  const [data, setData] = useState<APIWebCategories.Data[]>();

  const toList = () => {
    setLoad(true);
    doList()
      .then((response: APIResponse.Response<APIWebCategories.Data[]>) => {
        if (response.code === Constants.Success) {
          setData(response.data);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIWebCategories.Data) => {
    if (data) {
      const temp: APIWebCategories.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIWebCategories.Data) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '栏目删除成功！' });
          toList();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIWebCategories.Data[] = [...data];
          Loop.ById(
            temp,
            record.id,
            (item: APIWebCategories.Data) => (item.loading_deleted = false),
          );
          setData(temp);
        }
      });
  };

  const onEnable = (record: APIWebCategories.Data) => {
    if (data) {
      const temp: APIWebCategories.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIWebCategories.Data) => (item.loading_enable = true));
      setData(temp);
    }

    const enable: APIRequest.Enable = { id: record.id, is_enable: record.is_enable === 1 ? 2 : 1 };

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({
            message: `模块${enable.is_enable === 1 ? '启用' : '禁用'}成功！`,
          });
          if (data) {
            const temp = [...data];
            Loop.ById(
              temp,
              record.id,
              (item: APIWebCategories.Data) => (item.is_enable = enable.is_enable),
            );
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(
            temp,
            record.id,
            (item: APIWebCategories.Data) => (item.loading_enable = false),
          );
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIWebCategories.Data) => {
    setEditor(record);
    setVisible({ ...visible, editor: true });
  };

  const onSuccess = () => {
    setVisible({ ...visible, editor: false });
    toList();
  };

  const onCancel = () => {
    setVisible({ ...visible, editor: false });
  };

  useEffect(() => {
    toList();
  }, []);

  return (
    <>
      <Card
        title="栏目列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toList} loading={load} />
            </Tooltip>
            <Authorize permission="web.category.create">
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Authorize>
          </Space>
        }
      >
        <Table dataSource={data} rowKey="id" size="small" loading={load} pagination={false}>
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="URI"
            align="center"
            render={(record: APIWebCategories.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.uri}</Tag>
            )}
          />
          <Table.Column
            title="主题"
            align="center"
            render={(record: APIWebCategories.Data) => (
              <Tag color={record.theme && Themes[record.theme] ? Themes[record.theme].color : ''}>
                {record.theme && Themes[record.theme] ? Themes[record.theme].label : ''}
              </Tag>
            )}
          />
          <Table.Column
            title="图片"
            align="center"
            render={(record: APIWebCategories.Data) =>
              record.picture && <Image height={50} src={record.picture} />
            }
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIWebCategories.Data) => (
              <Authorize
                permission="web.category.enable"
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
            render={(record: APIWebCategories.Data) => (
              <>
                <Authorize permission="web.category.create">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="web.category.delete">
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

export default Tree;
