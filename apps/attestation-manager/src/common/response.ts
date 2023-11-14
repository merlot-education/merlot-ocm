export interface ResponseType {
  statusCode: number;
  message: string;
  data?: unknown;
  error?: unknown;
}
