declare namespace APIWebCategories {
  type Data = {
    id: number;
    theme?: string;
    uri?: string;
    name: string;
    picture: string;
    is_enable?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };
}
