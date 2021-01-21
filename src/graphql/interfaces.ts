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

export interface IIDInput {
  id: number;
}
