declare namespace APIWebProjects {

  type Data = {
    id: string;
    theme?: string;
    classification?: string;
    name: string;
    address: string;
    picture: string;
    order?: number;
    is_enable?: number;
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
