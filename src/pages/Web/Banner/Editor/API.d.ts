declare namespace APIWebBanner {

  type Props = {
    visible?: boolean;
    params?: APIWebBanners.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    theme?: string;
    picture?: string;
    name?: string;
    target?: string;
    url?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    theme?: string;
    pictures?: any[];
    name?: string;
    target?: string;
    url?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
    upload?: boolean;
  };

}
