declare namespace APIWebProject {
  type Props = {
    visible?: boolean;
    params?: APIWebProjects.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    classification?: string;
    theme?: string;
    name?: string;
    address?: string;
    height?: number;
    date?: string;
    picture?: string;
    pictures?: string[];
    title?: string;
    keyword?: string;
    description?: string;
    is_enable?: number;
    html?: string;
  };

  type Former = {
    classification?: string;
    theme?: string;
    name?: string;
    address?: string;
    height?: number;
    date?: any;
    picture?: any[];
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
    classification?: boolean;
  };
}
