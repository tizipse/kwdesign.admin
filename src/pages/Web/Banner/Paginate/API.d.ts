declare namespace APIWebBanners {

  type Data = {
    id: number;
    layout?: string;
    picture: string;
    name: string;
    target: string;
    url: string;
    is_enable?: number;
    order?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
  }

}
