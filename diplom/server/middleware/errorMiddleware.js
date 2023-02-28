import ApiError from '../error/ApiError.js'

const errorHandler = (err, req, res, next) => {
  if(err instanceof ApiError) {
    return res.status(err.status).json({message: err.message})
  }
  return res.status(500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

export {
  errorHandler
}