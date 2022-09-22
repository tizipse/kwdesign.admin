// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-namespace
declare namespace APIResponse {

  export type Response<T> = {
    code: number;
    message: string;
    data: T;
  }


  export type Paginate<T> = {
    code: number;
    message: string;
    data: {
      size: number;
      page: number;
      total: number;
      data?: T
    };
  }
}