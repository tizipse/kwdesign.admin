declare namespace APIWebPictures {

  type Data = {
    id: number;
    label: string;
    key: string;
    val?: string;
    required?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

}
