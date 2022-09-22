declare namespace APISitePermissions {
  type Data = {
    id?: number;
    parents?: number[];
    name?: string;
    slug?: string;
    method?: string;
    path?: string;
    children?: Data[];
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    module?: number;
  };

  type Loading = {
    module?: boolean;
  };
}
