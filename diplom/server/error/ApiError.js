class ApiError extends Error{
  constructor(status, message) {
    super();
    this.status = status
    this.message = message
  }

  static badRequest (data) {
    return new ApiError(400, data)
  }

  static internal(message) {
    return new ApiError(500, message)
  }

  static forbidden(message) {
    return new ApiError(403, message)
  }

  static unauthorized(message) {
    return new ApiError(401, message)
  }
}

export default ApiError