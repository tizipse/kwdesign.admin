declare namespace APISiteModules {

  type Data = {
    id: number;
    slug?: string;
    name: string;
    is_enable?: number;
    order?: number;
    children?: Data[];
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

}
