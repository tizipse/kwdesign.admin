declare namespace APIWebClassifications {
  type Data = {
    id: string;
    name: string;
    alias: string;
    order: number;
    is_enable?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Enable = {
    id?: string;
    is_enable?: number;
  };
}
