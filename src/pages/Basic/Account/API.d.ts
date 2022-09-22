declare namespace APIAccount {

  type Editor = {
    avatar?: string;
    nickname?: string;
    mobile?: string;
    email?: string;
    password?: string;
    signature?: string;
  }

  type Former = {
    pictures?: any[];
    username?: string;
    nickname?: string;
    mobile?: string;
    email?: string;
    password?: string;
    signature?: string;
  }

  type Loading = {
    confirm?: boolean;
    upload?: boolean;
  }
}
