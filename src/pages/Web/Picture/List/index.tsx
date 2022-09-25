import React, {useEffect, useState} from 'react';
import {Button, Card, Image, notification, Popconfirm, Space, Table, Tag, Tooltip} from 'antd';
import Constants from '@/utils/Constants';
import {FormOutlined, RedoOutlined} from '@ant-design/icons';
import {useModel} from 'umi';
import Editor from '@/pages/Web/Picture/Editor';
import {doDelete, doPaginate} from './service';
import Loop from '@/utils/Loop';
import Authorize from '@/components/Authorize';
import {Required} from '@/objects/Web/picture'

import styles from './index.less'

const Paginate: React.FC = () => {

  const {initialState} = useModel('@@initialState');

  const [editor, setEditor] = useState<APIWebPictures.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APIWebPictures.Visible>({});
  const [data, setData] = useState<APIWebPictures.Data[]>();

  const toPaginate = () => {
    setLoad(true);
    doPaginate()
      .then((response: APIResponse.Response<APIWebPictures.Data[]>) => {
        if (response.code === Constants.Success) {
          setData(response.data);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIWebPictures.Data) => {
    if (data) {
      const temp: APIWebPictures.Data[] = [...data];
      Loop.ById(temp, record.id, (item: APIWebPictures.Data) => (item.loading_deleted = true));
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '栏目删除成功！'});
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APIWebPictures.Data[] = [...data];
          Loop.ById(temp, record.id, (item: APIWebPictures.Data) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({...visible, editor: true});
  };

  const onUpdate = (record: APIWebPictures.Data) => {
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
    toPaginate();
  }, []);

  return (
    <>
      <Card
        title="图片列表"
        extra={
          <Space size={[10, 10]} wrap>
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined/>} onClick={toPaginate} loading={load}/>
            </Tooltip>
            <Authorize permission="web.picture.create">
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined/>} onClick={onCreate}/>
              </Tooltip>
            </Authorize>
          </Space>
        }
      >
        <Table dataSource={data} rowKey="id" loading={load} pagination={false}>
          <Table.Column title="名称" dataIndex="label"/>
          <Table.Column
            title="图片"
            align="center"
            render={(record: APIWebPictures.Data) => (
              record.val ?
                <Image src={record.val} height={50} className={styles.picture}/> :
                <Tag color='#f50'>无</Tag>
            )}
          />
          <Table.Column
            title="代码"
            align="center"
            render={(record: APIWebPictures.Data) => (
              <Tag color={initialState?.settings?.primaryColor}>{record.key}</Tag>
            )}
          />
          <Table.Column
            title="必须"
            align="center"
            render={(record: APIWebPictures.Data) => (
              <Tag color={record.required && Required[record.required] ? Required[record.required].color : ''}>
                {record.required && Required[record.required] ? Required[record.required].label : ''}
              </Tag>
            )}
          />
          <Table.Column
            align="center"
            width={100}
            render={(record: APIWebPictures.Data) => (
              <>
                <Authorize permission="web.picture.update">
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Authorize>
                <Authorize permission="web.picture.delete">
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
        <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel}/>
      )}
    </>
  );
};

export default Paginate;
