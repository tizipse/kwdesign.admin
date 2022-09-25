declare namespace APIWebProjects {

  type Data = {
    id: string;
    theme?: string;
    classification?: string;
    name: string;
    address: string;
    picture: string;
    dated_at: string;
    order?: number;
    is_enable?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Enable = {
    id?: string;
    is_enable?: number;
  }

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
  }

}
