declare namespace APIWeb {

  type Category = {
    id?: number;
    theme?: string;
    uri?: string;
    name?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    html?: string;
    is_enable?: number;
  };

  type Classification = {
    name?: string;
    order?: number;
    is_enable?: number;
    title?: string;
    keyword?: string;
    description?: string;
  };

  type ClassificationByEnable = {
    id?: string;
    name?: string;
  };

  type Project = {
    id?: string;
    classification?: string;
    theme?: string;
    name?: string;
    address?: string;
    picture?: string;
    title?: string;
    keyword?: string;
    description?: string;
    dated_at?: string;
    html?: string;
    pictures?: string[];
    is_enable?: number;
  }

}
