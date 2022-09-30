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
import Editor from '@/pages/Web/Banner/Editor';
import { doDelete, doEnable, doPaginate } from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Authorize';
import Enable from '@/components/Enable';
import { Targets } from '@/objects/Web/banner';
import { Themes } from '@/objects/Web/basic';

import styles from './index.less';

const Paginate: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const [search, setSearch] = useState<APIWebBanners.Search>({});
  const [editor, setEditor] = useState<APIWebBanners.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APIWebBanners.Visible>({});
  const [data, setData] = useState<APIWebBanners.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoad(true);
    doPaginate()
      .then((response: APIResponse.Paginate<APIWebBanners.Data[]>) => {
        if (response.code === Constants.Success) {
          setData(response.data.data);
          setPaginate({
            total: response.data.total,
            size: response.data.size,
            page: response.data.page,
          });
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIWebBanners.Data) => {
    if (data) {
      const temp: APIWebBanners.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIWebBanners.Data) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '栏目删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIWebBanners.Data[] = [...data];
          Loop.ById(temp, record.id, (item: APIWebBanners.Data) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onEnable = (record: APIWebBanners.Data) => {
    if (data) {
      const temp: APIWebBanners.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIWebBanners.Data) => (item.loading_enable = true));
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
              (item: APIWebBanners.Data) => (item.is_enable = enable.is_enable),
            );
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          Loop.ById(temp, record.id, (item: APIWebBanners.Data) => (item.loading_enable = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIWebBanners.Data) => {
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
        title="轮播列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined />} onClick={toPaginate} loading={load} />
            </Tooltip>
            <Authorize permission="web.banner.create">
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
            current: paginate.page,
            pageSize: paginate.size,
            total: paginate.total,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column title="名称" dataIndex="name" />
          <Table.Column
            title="图片"
            align="center"
            render={(record: APIWebBanners.Data) => (
              <Image src={record.picture} height={50} className={styles.picture} />
            )}
          />
          <Table.Column
            title="主题"
            align="center"
            render={(record: APIWebBanners.Data) => (
              <Tag color={record.theme && Themes[record.theme] ? Themes[record.theme].color : ''}>
                {record.theme && Themes[record.theme] ? Themes[record.theme].label : ''}
              </Tag>
            )}
          />
          <Table.Column
            title="打开"
            align="center"
            render={(record: APIWebBanners.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>
                {record.target && Targets[record.target] ? Targets[record.target] : record.target}
              </Tag>
            )}
          />
          <Table.Column
            title="序号"
            align="center"
            render={(record: APIWebBanners.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
            )}
          />
          <Table.Column
            title="启用"
            align="center"
            render={(record: APIWebBanners.Data) => (
              <Authorize
                permission="web.banner.enable"
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
            render={(record: APIWebBanners.Data) => (
              <>
                <Authorize permission="web.banner.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="web.banner.delete">
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
