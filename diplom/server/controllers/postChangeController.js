import ApiError from "../error/ApiError.js";
import { PostSuggestedChanges} from "../models/models.js";
import {connection} from "../server.js";

export const suggestChange = async (req, res, next) => {
  // тест создается автоматически
  const {newText, postId} = req.body

  /*if (typeof(newText) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_CONTENT))
  }
  if (typeof(userId) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }*/

  const data = await PostSuggestedChanges.create({
    text: newText,
    postId: postId,
    userId: req.user.id
  })

  return res.json(data)
}

export const getChangesOfUser = async (req, res, next) => {
  try {
    // тест создается автоматически
    const {authorId} = req.body

    /*if (typeof(newText) !== 'string') {
      return next(ApiError.badRequest(WRONG_POST_CONTENT))
    }
    if (typeof(userId) !== 'string') {
      return next(ApiError.badRequest(WRONG_POST_TITLE))
    }*/



    const data = await PostSuggestedChanges.findAll({
      where: {
        userId: req.user.id
      }
    })

    return res.json(data)
  } catch (e) {
    return next(ApiError.badRequest('Вы не отправляли изменений'))
  }

}

export const getChange = async (req, res, next) => {
  const {postId} = req.params
  const userId = req.user.id
  /*if (typeof(newText) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_CONTENT))
  }
  if (typeof(userId) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }*/

  const data = await PostSuggestedChanges.findOne({
    where: {
      userId,
      postId
    }
  })

  if (data) {
    data.dataValues.text = JSON.parse(data.dataValues.text)
  } else {
    return res.json(null)
  }

  return res.json(data)
}

export const getChangeAdmin = async (req, res, next) => {
  const {userId, postId} = req.params
  /*if (typeof(newText) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_CONTENT))
  }
  if (typeof(userId) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }*/

  const data = await PostSuggestedChanges.findOne({
    where: {
      userId,
      postId
    }
  })
  data.text = JSON.parse(data.text)

  return res.json(data)
}



export const getAllChanges = async (req, res, next) => {

  /*
  postTitle}</tb>
      </tr>
      <tr>
        <th>Кем предложено</th>
        <td>{suggestedChange.userName}</td>
      </tr>
      <tr>
        <th>Дата</th>
        <td>{suggestedChange.date
   */

  const [data] = await connection.execute(
    `select psc.id as psc_id, p.title as postTitle, p.id as p_id, u.name as userName, u.id as u_id, psc.updatedAt
from post_suggested_changes psc
join posts p on psc.postId=p.id
join users u on psc.userId=u.id`)

  return res.json(data)
}



export const updateChangeOfPosts = async (req, res, next) => {
  try {
    // тест создается автоматически
    const {newText} = req.body

    const postId = req.params.postId
    /*if (typeof(newText) !== 'string') {
      return next(ApiError.badRequest(WRONG_POST_CONTENT))
    }

    PostChangeHistory

    if (typeof(userId) !== 'string') {
      return next(ApiError.badRequest(WRONG_POST_TITLE))
    }*/


    await PostSuggestedChanges.update(
      {
        text: newText,
      },
      {where: {userId: req.user.id, postId: postId}, returning: true, plain: true}
    )

    const data = await PostSuggestedChanges.findOne({
      where: {
        userId: req.user.id,
        postId: postId
      }
    })

    return res.json(data)
  } catch (e) {
    return next(ApiError.badRequest('Отсутсвуют изменения для поста'))
  }

}