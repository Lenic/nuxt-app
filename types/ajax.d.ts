declare interface IErrorResult<TError extends Error = Error> {
  handled: boolean;
  error?: TError;
}
