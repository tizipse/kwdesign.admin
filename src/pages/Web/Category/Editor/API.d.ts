declare namespace APIWebCategory {
  type Props = {
    visible?: boolean;
    params?: APIWebCategories.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    uri?: string;
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    is_required_picture?: number;
    is_required_html?: number;
    is_enable?: number;
    html?: string;
  };

  type Former = {
    uri?: string;
    name?: string;
    pictures?: any[];
    title?: string;
    keyword?: string;
    description?: string;
    is_required_picture?: number;
    is_required_html?: number;
    is_enable?: number;
    html?: any;
  };

  type Loading = {
    confirmed?: boolean;
    upload?: boolean;
    information?: boolean;
  };
}
