declare namespace APIWebContacts {
  type Data = {
    id: number;
    city?: string;
    address: string;
    telephone: string;
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
  };
}
