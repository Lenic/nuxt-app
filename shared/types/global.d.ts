declare interface IErrorResult<TError extends Error = Error> {
  handled: boolean;
  error: TError;
}

declare interface IErrorResponse {
  code: Exclude<number, 0>;
  msg: string;
}

declare interface ISuccessResponse<TData = unknown> {
  code: 0;
  data: TData;
}

declare type TResponse<TData = unknown> = IErrorResponse | ISuccessResponse<TData>;
