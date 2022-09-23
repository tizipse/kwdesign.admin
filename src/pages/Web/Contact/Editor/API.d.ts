declare namespace APIWebContact {
  type Props = {
    visible?: boolean;
    params?: APIWebContacts.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    city?: string;
    address?: string;
    telephone?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    city?: string;
    address?: string;
    telephone?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
