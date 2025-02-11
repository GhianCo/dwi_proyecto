export interface IResponse {
  code: number | string;
  data: any;
  pagination?: any,
  message: string;
}
