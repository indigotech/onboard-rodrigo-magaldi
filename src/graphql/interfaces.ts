export interface ILoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ICreateUserInput {
  name: string;
  email: string;
  birthDate: string;
  cpf: string;
  password: string;
}

export interface IQueryUserInput {
  id: number;
}

export interface IQueryUsersInput {
  limit: number;
  offset: number;
}
