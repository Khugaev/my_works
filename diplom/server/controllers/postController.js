import ApiError from "../error/ApiError.js";
import {Post, PostChangeHistory, Question, Score, Test, User, Variant} from "../models/models.js";
import {
  TEST_ALREADY_PASSED, TEST_NOT_EXIST,
  USER_NOT_EXIST,
  WRONG_POST_CONTENT,
  WRONG_POST_ID,
  WRONG_POST_TITLE,
  WRONG_TEST_ID,
  WRONG_USER_ID
} from "../error/errorCodes.js";

export const  createPost = async (req, res, next) => {
  // тест создается автоматически
  const {title, postText, authorId} = req.body

  if (typeof(postText) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_CONTENT))
  }
  if (typeof(title) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }
  if (!authorId) {
    return next(ApiError.badRequest('Неверный ид автора'))
  }

  const result = await Post.create({
    title: title,
    text: postText,
    authorId: authorId
  })

  await PostChangeHistory.create({
    postId: result.dataValues.id,
    title: title,
    text: postText,
    authorId: authorId
  })


  return res.json(result)
}

export const deletePost = async (req, res, next) => {
  const {postId} = req.query
  if (isNaN(Number(postId)) && !Number.isInteger(postId)){
    return next(ApiError.badRequest(WRONG_POST_ID))
  }

  const result = await Post.destroy({
    where: {id: postId}
  })

  return res.json(result)
}

export const updatePost = async (req, res, next) => {
  const {postId, post} = req.body
  const {title, postText} = post
  if (isNaN(Number(postId)) && !Number.isInteger(postId)){
    return next(ApiError.badRequest(WRONG_POST_ID))
  }
  if (typeof(postText) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_CONTENT))
  }
  if (typeof(title) !== 'string') {
    return next(ApiError.badRequest(WRONG_POST_TITLE))
  }
  await Post.update(
    {text: postText, title: title},
    {where: {id: postId}}
  )
  await PostChangeHistory.create({
    postId: postId,
    title: title,
    text: postText,
    authorId: req.user.id
  })
  const result = await Post.findOne({
    where: {id: postId},
    order: [ [ 'createdAt' ]]
    }
  )
  result.text = JSON.parse(result.text)
  return res.json(result)
}

export const getPostTitles = async (req, res) => {
  const titles = await Post.findAll({
    attributes: ['id', 'title']
  })
  const tests = await Test.findAll({
    attributes: ['id', 'postId']
  })
  for (let title of titles) {
    for (let test of tests) {
      if (title.dataValues.id === test.dataValues.postId) {
        title.dataValues.testId = test.dataValues.id
      }
    }
    if (!title.dataValues.testId) title.dataValues.testId = null
  }
  return res.json(titles)
}

export const getPost = async (req, res, next) => {
  const id = req.params.id

  if (isNaN(Number(id)) && !Number.isInteger(id)) {
    return next(ApiError.badRequest(WRONG_POST_ID))
  }

  const result = await Post.findOne({
    where: {
      id: id
    },
    order: [ [ 'createdAt' ]]
  })

  if (!result) {
    return next(ApiError.badRequest('Пост не найден'))
  }

  result.text = JSON.parse(result.text)
  return res.json(result)
}

export const passTest = async (req, res, next) => {
  const testId = Number(req.params.id)
  const userId =  Number(req.body.userId)

  if(isNaN(testId) && !Number.isInteger(testId)) {
    return next(ApiError.badRequest(WRONG_TEST_ID))
  }
  if(isNaN(userId) && !Number.isInteger(userId)) {
    return next(ApiError.badRequest(WRONG_USER_ID))
  }

  const existingUser = await User.findOne({
    where: {
      id: userId
    }
  })
  if (existingUser === null) {
    return next(ApiError.badRequest(USER_NOT_EXIST))
  }

  const existingResult = await Score.findOne({
    where: {
      testId: testId,
      userId: userId
    }
  })
  if (existingResult !== null) {
    return next(ApiError.badRequest(TEST_ALREADY_PASSED))
  }

  const answers = req.body.answers

  const questions = await Question.findAll({
    where: {
      testId: testId
    }
  })

  let variant
  let score = {}
  let varData
  let answersCorrectness = {}
  let isTrueAnswer = true
  let questionId
  try {
    let i = 0, j = 0
    for (let qKeys in answers) {
      questionId = questions[i].dataValues.id
      variant = await Variant.findAll({ // здесь я без await сделал
        where: {
          questionId: questions[i].dataValues.id
        }
      })
      j = 0
      for (let vKeys in answers[qKeys]){
        varData = variant[j].dataValues
        isTrueAnswer = isTrueAnswer && (answers[qKeys][vKeys] === varData.is_answer)
        answersCorrectness[vKeys] = isTrueAnswer
        j += 1
      }
      score[qKeys] = isTrueAnswer ? questions[i].dataValues.score : 0
      isTrueAnswer = true
      i += 1
    }
    let totalScore = 0
    for (let i in score) {
      totalScore = totalScore + score[i]
    }
    await Score.create({
      totalScore: Number(totalScore),
      score: JSON.stringify(score/*Object.assign({}, score)*/),
      answersCorrectness: JSON.stringify(answersCorrectness/*Object.assign({}, answersCorrectness)*/),
      userId: userId,
      testId: testId
    })
    return res.json({totalScore, score, answersCorrectness})
  } catch (e) {
    return next(ApiError.badRequest(e.message))
  }
}

export const getTest = async (req, res, next) => {
  const postId = req.params.id
  if(isNaN(Number(postId)) && !Number.isInteger(postId)) {
    return next(ApiError.badRequest(WRONG_USER_ID))
  }

  const test = await Test.findOne({
    where: {
      postId: postId
    }
  })

  if (test === null) {
    return next(ApiError.badRequest(TEST_NOT_EXIST))
  }

  const questions = await Question.findAll({
    where: {
      testId: test.dataValues.id
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })

  let variants
  for (let i in questions) {
    variants = await Variant.findAll({
      where: {
        questionId: questions[i].dataValues.id
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'is_answer']
      }
    })
    questions[i].dataValues.variants = variants
  }
  return res.json({questions, testId: test.dataValues.id})
}