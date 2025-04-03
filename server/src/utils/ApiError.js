// Define a custom error class ApiError that extends the built-in Error class
class ApiError extends Error {
  constructor(
    statusCode,
    msg = 'something went wrong',
    errors = [],
    stack = '' // Optional stack trace
  ) {
    super(msg); // Call the parent Error constructor with the error message
    this.statusCode = statusCode;
    this.data = null;
    this.msg = msg;
    this.success = false;
    this.errors = errors;

    // If a stack trace is provided, use it; otherwise, capture the current stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
    }
  }
}

export { ApiError };
