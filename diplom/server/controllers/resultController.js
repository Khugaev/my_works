import ApiError from "../error/ApiError.js";
import {Post, Question, Score, Test, Variant} from "../models/models.js";

export const getResults = async (req, res, next) => {
  const userId = req.query.userId
  if(isNaN(Number(userId)) && !Number.isInteger(userId)) {
    return next(ApiError.badRequest('Некорректный id пользователя'))
  }

  const result = await Score.findAll({
    where: {
      userId: userId,
    }
  })
  if (result === null) {
    return res.json(null)
  }
  let post
  let test
  for (let i in result) {
    test = await Test.findOne({
      where: {
        id: result[i].dataValues.testId,
      },
    })
    post = await Post.findOne({
      where: {
        id: test.dataValues.postId,
      },
      attributes:['title']
    })
    if (post === null) {
      return next(ApiError.badRequest('Теста для результатов не существует'))
    }
    result[i].dataValues.title = post.dataValues.title
  }
  return res.json(result)
}

export const getResult = async (req, res, next) => {
  const testId = req.params.id
  const userId = req.query.userId

  if (testId === null) {
    return res.json({})
  }

  if(isNaN(Number(testId)) && !Number.isInteger(testId)) {
    return next(ApiError.badRequest('Некорректный id теста'))
  }
  if(isNaN(Number(userId)) && !Number.isInteger(userId)) {
    return next(ApiError.badRequest('Некорректный id пользователя'))
  }

  const score = await Score.findOne({
    where: {
      userId: userId,
      testId: testId
    }
  })
  if (score == null) {
    return res.json({})
  }
  return res.json({
    score: JSON.parse(score.dataValues.score),
    totalScore: score.dataValues.totalScore,
    answersCorrectness: JSON.parse(score.dataValues.answersCorrectness)
  })
}

export const updateResult = async (req, res, next) => {
  const testId = Number(req.params.id)
  const userId = Number(req.body.userId)

  if(isNaN(Number(testId)) && !Number.isInteger(testId)) {
    return next(ApiError.badRequest('Некорректный id теста'))
  }
  if(isNaN(Number(userId)) && !Number.isInteger(userId)) {
    return next(ApiError.badRequest('Некорректный id пользователя'))
  }

  const existingResult = await Score.findOne({
    where: {
      testId: testId,
      userId: userId
    }
  })
  if (existingResult === null) {
    return next(ApiError.badRequest('Этот тест еще не был пройден'))
  }

  const answers = req.body.answers
  const questions = await Question.findAll({
    where: {
      testId: testId
    }
  })

  let variants
  let score = {}
  let varData
  let answersCorrectness = {}
  let isTrueAnswer = true
  let questionId
  try{

    let i = 0, j = 0
    for (let qKeys in answers) {
      questionId = questions[i].dataValues.id
      variants = await Variant.findAll({ // здесь я без await сделал
        where: {
          questionId: questions[i].dataValues.id
        }
      })
      j = 0
      if (questions[i].dataValues.type === 'radio') {
        for (let vKeys in answers[qKeys]){
          varData = variants[j].dataValues
          isTrueAnswer = isTrueAnswer && (answers[qKeys][vKeys] === varData.is_answer)
          answersCorrectness[vKeys] = isTrueAnswer
          j += 1
        }
        score[qKeys] = isTrueAnswer ? questions[i].dataValues.score : 0
      } else if (questions[i].dataValues.type === 'checkbox') {
        let countOfTrueAnswers = 0
        let countOfAnswers = 0
        // подсчет правильных вариантов
        for (let variant of variants) variant.dataValues.is_answer && countOfAnswers++

        for (let vKeys in answers[qKeys]) answersCorrectness[vKeys] = false
        for (let vKeys in answers[qKeys]){
          varData = variants[j].dataValues
          if (varData.is_answer === false && answers[qKeys][vKeys]) {
            // если вариант не является правильным ответом
            // и он был отмечен пользователем как правильный
            // резултат - 0
            countOfTrueAnswers = 0
            break
          }
          // правильно ли ответил пользователь
          answersCorrectness[vKeys] = answers[qKeys][vKeys] === varData.is_answer
          // если вариант является правильным и
          // дан верный ответ, то число праильных
          // ответов увеличивается
          varData.is_answer && answersCorrectness[vKeys] && countOfTrueAnswers++
          j += 1
        }
        score[qKeys] = (countOfTrueAnswers / countOfAnswers) * questions[i].dataValues.score
      }

      isTrueAnswer = true
      i += 1
    }

    let totalScore = 0
    for (let i in score) {
      totalScore = totalScore + score[i]
    }
    await Score.update(
      {
        totalScore: Number(totalScore),
        score: JSON.stringify(score),
        answersCorrectness: JSON.stringify(answersCorrectness)
      },
      {where: {userId: userId, testId: testId}}
    )
    return res.json({totalScore, score, answersCorrectness})

  } catch (e) {
    return next(ApiError.badRequest(e.message))
  }
}