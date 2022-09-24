declare namespace APIWebSetting {

  type Data = {
    id?: string;
    type?: string;
    label?: string;
    key?: string;
    val?: string;
    required?: number;
    created_at?: string;
  };

  type Preview = {
    visible?: boolean;
    title?: string;
    picture?: string;
  }
}
