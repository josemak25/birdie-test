interface CustomErrorInterface {
  handler: Function;
  notFound: Function;
  converter: Function;
  errorHandler: Function;
}

interface HttpExceptionInterface {
  status: number;
  message: string;
  payload?: object;
  errors: object | null;
  stack?: string | undefined;
  isPublic?: boolean | undefined;
}

interface JoiErrorInterface {
  type: string;
  path: string[];
  message: string;
}

interface ResponseInterface {
  message?: string;
  statusCode: number;
  token?: string | null;
  errors?: object | null;
  payload?: object | null;
}
