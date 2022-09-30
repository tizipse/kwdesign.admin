declare namespace APIWebCategories {
  type Data = {
    id: number;
    uri?: string;
    name: string;
    picture: string;
    is_required_picture?: number;
    is_required_html?: number;
    is_enable?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
    loading_required_picture?: boolean;
    loading_required_html?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type RequiredPicture = {
    id: number;
    is_required_picture?: number;
  };

  type RequiredHtml = {
    id: number;
    is_required_html?: number;
  };
}
