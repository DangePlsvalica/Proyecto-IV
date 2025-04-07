export interface RegisterData {
  email: string;
  password: string;
  role: string;
}

export interface RegisterOptions {
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface RegisterResponse extends RegisterData {
  success: boolean;
  error?: string;
}


  