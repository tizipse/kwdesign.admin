declare namespace APISiteAdmin {
  type Props = {
    visible?: boolean;
    params?: APISiteAdmins.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    username?: string;
    nickname?: string;
    password?: string;
    signature?: string;
    roles?: number[];
  };

  type Former = {
    username?: string;
    nickname?: string;
    password?: string;
    signature?: string;
    roles?: number[];
  };

  type Role = {
    id?: number;
    name?: string;
  };

  type Loading = {
    confirmed?: boolean;
    permission?: boolean;
  };
}
