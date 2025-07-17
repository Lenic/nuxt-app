export function isSuccessResponse(response: any): response is ISuccessResponse {
  return response.code === 0 && 'data' in response;
}

export function isErrorResponse(response: any): response is IErrorResponse {
  return response.code !== 0 && 'msg' in response && typeof response.msg === 'string';
}

export function isErrorResult<TError extends Error = Error>(
  result: IErrorResult<TError>,
): result is IErrorResult<TError> {
  return 'handled' in result && result.handled;
}

export function isResponse(response: any): response is ISuccessResponse | IErrorResponse {
  if (!('code' in response)) return false;

  if (response.code === 0 && 'data' in response) return true;
  if (response.code !== 0 && 'msg' in response) return true;

  return false;
}
