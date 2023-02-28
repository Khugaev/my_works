import {PostComments, User} from '../models/models.js'
import ApiError from "../error/ApiError.js";
import {WRONG_POST_CONTENT, WRONG_POST_TITLE} from "../error/errorCodes.js";
import {connection} from "../server.js";

export const saveComment = async (req, res, next) => {
  const {text, postId, parentId} = req.body
  const userId = req.user.id

  /*if (typeof(postId) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_CONTENT))
  }
  if (typeof(userId) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }
  if (typeof(text) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }*/
  if (isNaN(Number(parentId))) {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }

  const {dataValues} = await PostComments.create({
    postId: postId,
    userId: userId,
    parentId : parentId,
    text: text
  })
  return res.json(dataValues)

}

export const getComments = async (req, res, next) => {
  const postId = req.query.postId

  const count = await PostComments.count({
    where: {
      postId: postId
    }
  })

  const commentsToShowCount = Number(req.query.offset) || 10

  if (typeof(postId) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_CONTENT))
  }

  await connection.query(`set @maxIndexLength = 0;`)

  await connection.query(`select @maxIndexLength := length(max(id)) from post_comments;`)

  const [data] = await connection.query(`WITH RECURSIVE cte AS(
    SELECT id, text, parentId, userId, postId, createdAt, updatedAt,
             (concat(repeat('0', @maxIndexLength - length(id)), id)) AS path,  0 as depth FROM post_comments  WHERE parentId = 0 and postId = ${postId}
             union
      SELECT p.id, p.text, p.parentId, p.userId, p.postId, p.createdAt, p.updatedAt, concat(cte.path, ',' , concat(repeat('0', @maxIndexLength - length(p.id)), p.id)) AS path, cte.depth+1 FROM post_comments p JOIN cte
      ON cte.id=p.parentId)

SELECT cte.*, u.name FROM cte 
join users u on u.id = cte.userId ORDER BY path
limit ${commentsToShowCount} ;`)

  const comments = []
  for(let i = 0; i < data.length; i++) {
    const parentId = data[i].parentId
    if (data[i].text === '') {
      data[i].deleted = true
      data[i].text = 'Комментарий был удалён'
    }
    if (parentId !== 0) {
      // должно быть гарантированно, что родитель записан
      const parent = data.find(comment => comment.id === parentId)

      if (!parent.replies) parent.replies = []
      parent.replies.push(data[i])
    } else {
      comments.push(data[i])
    }
  }

  return res.json({comments, commentsToShowCount, count})

}

export const updateComment = async(req, res, next) => {
  const {commentId, newText} = req.body
  await PostComments.update(
    {text: newText},
    {where: {id: commentId}}
  )

  const [data] = await connection.query(
    `select pc.*, u.name from post_comments pc join users u on pc.userId = u.id  where pc.id = ${commentId}`
  )
  return res.json(data[0])
}

export const deleteComment = async(req, res, next) => {
  const {commentId} = req.body
  try {
    await PostComments.update(
      {text: ''},
      {where: {id: commentId}}
    )
    return res.json({message: 'Сообщение было удалено', commentId: commentId})

  } catch (e) {
    return next(ApiError.badRequest(e))
  }
}