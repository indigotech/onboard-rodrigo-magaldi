export class CustomError extends Error {
  httpCode: number;
  details?: string;
  name: string;

  constructor(message: string, httpCode: number, details?: string) {
    super(message);
    this.httpCode = httpCode;
    this.details = details;
    this.name = 'CustomError';
  }
}

export function formatError(error: any) {
  if (error.originalError?.name === 'CustomError') {
    return {
      ...error,
      ...error.originalError,
      message: error.message,
    };
  } else {
    return {
      ...error,
      message: 'Erro!',
      details: error.message,
    };
  }
}
