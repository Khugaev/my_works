import ApiError from "../error/ApiError.js";
import {User} from "../models/models.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

function generateJwt(id, email, role) {
  return jwt.sign({id, email, role},
    process.env.SECRET_KEY,
    {expiresIn: '7d'}
  )
}

const registerUser = async (req, res, next) => {
  try {
    const {name, email, password/*, role*/} = req.body

    if (!name) {
      return next(ApiError.badRequest('Введите имя'))
    }
    if (!email) {
      return next(ApiError.badRequest('Введите email'))
    }
    if (!password) {
      return next(ApiError.badRequest('Введите пароль'))
    }

    if (typeof(name) !== 'string' || typeof(email) !== 'string' || typeof(password) !== 'string') {
      return next(ApiError.badRequest('Некорректный email или пароль'))
    }

    const candidate = await User.findOne({where:{email}})
    if(candidate) {
      return next(ApiError.badRequest('Пользователь с таким email уже существует'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({name, email, role: "USER", password: hashPassword})
    const token = generateJwt(user.id, email, user.role)

    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    })
  } catch (e) {
    next(new Error(e.message))
  }
}

const authUser = async (req, res, next) => {
  try {
    const {email, password} = req.body

    if (!email) {
      return next(ApiError.badRequest('Введите email'))
    }
    if (!password) {
      return next(ApiError.badRequest('Введите пароль'))
    }

    if (typeof(email) !== 'string' || typeof(password) !== 'string') {
      return next(ApiError.badRequest('Некорректный email или пароль'))
    }

    const user = await User.findOne({where: {email}})

    if(!user) {
      return next(ApiError.badRequest('Неверный email или пароль'))
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password)

    if(!isCorrectPassword) {
      return next(ApiError.badRequest('Неверный email или пароль'))
    }

    const token = generateJwt(user.id, email, user.role)
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token
    })
  } catch (e) {
    next(new Error(e.message))
  }
}

const changeRole = async (req, res, next) => {
  try {
    const {userId, role} = req.body
    if (!userId) {
      return next(ApiError.badRequest('Введите имя'))
    }
    if (role !== 'EDITOR' && role !== 'USER') {
      return next(ApiError.badRequest('Неверно введена роль'))
    }

    await User.update(
      {role: role},
      {where: {id: userId}}
    )

    return res.json(true)
  } catch (e) {
    next(new Error(e.message))
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const {userId} = req.query
    if (!userId) {
      return next(ApiError.badRequest('Введите имя'))
    }

    await User.destroy({where: {id: userId}})

    return res.json(true)
  } catch (e) {
    next(new Error(e.message))
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const data = await User.findAll({attributes: {exclude: ['password']}})
    return res.json(data)
  } catch (e) {
    next(new Error(e.message))
  }
}

export {
  registerUser,
  authUser,
  changeRole,
  getAllUsers,
  deleteUser
}