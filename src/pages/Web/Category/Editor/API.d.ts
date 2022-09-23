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
    theme?: string;
    uri?: string;
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    is_enable?: number;
    html?: string;
  };

  type Former = {
    theme?: string;
    uri?: string;
    name?: string;
    pictures?: any[];
    title?: string;
    keyword?: string;
    description?: string;
    is_enable?: number;
    content?: any;
  };

  type Loading = {
    confirmed?: boolean;
    upload?: boolean;
    information?: boolean;
  };
}
