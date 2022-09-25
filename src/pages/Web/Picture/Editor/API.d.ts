declare namespace APIWebPicture {

  type Props = {
    visible?: boolean;
    params?: APIWebPictures.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    label?: string;
    key?: string;
    val?: string;
    required?: number;
  };

  type Former = {
    label?: string;
    key?: string;
    val?: any[];
    required?: number;
  };

  type Loading = {
    confirmed?: boolean;
    upload?: boolean;
  };

}
