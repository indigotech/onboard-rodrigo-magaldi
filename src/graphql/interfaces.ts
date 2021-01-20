export interface LoginInterface {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CreateuserInterface {
  name: string;
  email: string;
  birthDate: string;
  cpf: string;
  password: string;
}

export interface IDInterface {
  id: number;
}
