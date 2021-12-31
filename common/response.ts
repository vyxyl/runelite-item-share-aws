export interface ApiResponse {
  statusCode: number;
  body: string;
}

export function serverError(message: any = '') {
  return response(500, message);
}

export function badRequest(message: any = '') {
  return response(400, { message });
}

export function success(data: any = {}) {
  return response(200, data);
}

export function response(statusCode: number, data: any = {}) {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
}
