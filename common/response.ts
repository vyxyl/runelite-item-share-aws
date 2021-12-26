export function serverError(message = '') {
  return response(500, message);
}

export function badRequest(message = '') {
  return response(400, { message });
}

export function success(data = {}) {
  return response(200, data);
}

export function response(statusCode, data = {}) {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
}
