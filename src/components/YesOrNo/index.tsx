import { Tag } from 'antd';

const Enable = (props: APIYesOrNo.Props) => {
  return <Tag color={props.is_yes ? '#87d068' : '#f50'}>{props.is_yes === 1 ? '是' : '否'}</Tag>;
};

export default Enable;
