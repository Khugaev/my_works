import jwtToken from 'jsonwebtoken'
import {User} from "../models/models.js";
import ApiError from "../error/ApiError.js";

export const protect = async (req, res, next) => {
  let token
  if(req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwtToken.verify(token, process.env.SECRET_KEY)
      req.user = (await User.findOne({ where: { id: decoded.id } })).dataValues
      next()

    } catch (e) {
      return next(ApiError.unauthorized('Вы не авторизованы, неверный токен'))
    }
  }
  if(!token) {
    return next(ApiError.unauthorized('Вы не авторизованы, неверный токен'))
  }
}

export const isAdmin = async (req, res, next) => {
  let token

  if(req.headers.authorization &&
  req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwtToken.verify(token, process.env.SECRET_KEY)
      if (decoded.role === 'ADMIN') {
        req.user = (await User.findOne({ where: { id: decoded.id } })).dataValues
        return next()
      }
      else {
        return next(ApiError.unauthorized('Вы не являетесь администратором'))
      }
    } catch (e) {
      return next(ApiError.unauthorized('Вы не авторизованы, неверный токен'))
    }
  }

  if(!token) {

    return next(ApiError.unauthorized('Вы не авторизованы, отсутсвует токен'))
  }
}