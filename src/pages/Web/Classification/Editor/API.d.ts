declare namespace APIWebClassification {

  type Props = {
    visible?: boolean;
    params?: APIWebClassifications.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    order?: number;
    title?: string;
    keyword?: string;
    description?: string;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    order?: number;
    title?: string;
    keyword?: string;
    description?: string;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
    information?: boolean;
  };
}
