// Define a custom error class ApiResponse

class ApiResponse {
  constructor(statusCode, msg = 'success', data) {
    this.statusCode = statusCode;
    this.msg = msg;
    this.data = data;
    this.success = statusCode < 400; //it return true or false
  }
}

export { ApiResponse };
