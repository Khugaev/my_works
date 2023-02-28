import ApiError from "../error/ApiError.js"
import {Test, Question, Variant} from "../models/models.js"

export const createTest = async (req, res, next) => {
  const {questions, postId} = req.body
  if(isNaN(Number(postId)) && !Number.isInteger(Number(postId))) { // если не число или не целое число
    return next(ApiError.badRequest('Некорректный id теста(поста)'))
  }
  if(!questions) {
    return next(ApiError.badRequest('Отсутсвуют вопросы'))
  }

  for (let question of questions) {
    if(!question.title) {
      return next(ApiError.badRequest(`Отсутсвует формулировка вопроса в "${question}" вопросе`))
    } else if(question.score === undefined) {
      return next(ApiError.badRequest(`Отсутсвует количество баллов для "${question}" вопроса`))
    } else if(!question.type) {
      return next(ApiError.badRequest(`Отсутсвует тип "${question}" вопроса`))
    } else if(!question.variants) {
      return next(ApiError.badRequest(`Отсутсвуют варианты к "${question}" вопросу`))
    }
    for (let variant of question.variants) {
      if(!variant.title) {
        return next(ApiError.badRequest(`Отсутсвует заголовок "${variant}" варианта к "${question}" вопросу`))
      } else if(variant.is_answer === undefined) {
        return next(ApiError.badRequest(`Отсутсвует правильность "${variant}" варианта к "${question}" вопросу`))
      }
    }
  }

  const existingTest = await Test.findOne({
    where: {
      postId: postId
    }
  })

  if (existingTest !== null) {
    return next(ApiError.badRequest('Тест для этого поста уже существует'))
  }


  try {
    const test = (await Test.create(
      {postId: postId}
    )).dataValues
    let questionElem;
    test.questions = []
    for (let question of questions) {
      questionElem = (await Question.create({ // здесь я без await сделал
        title: question.title,
        score: question.score,
        type: question.type,
        testId: test.id
      })).dataValues
      test.questions.push(questionElem)
      test.questions[test.questions.length - 1].variants = []
      let variantElem
      for (let variant of question.variants){
        variantElem = await Variant.create({ // здесь я без await сделал
          title: variant.title,
          is_answer: variant.is_answer,
          questionId: questionElem.id
        })
        test.questions[test.questions.length - 1].variants.push(variantElem)
      }
    }

    return res.json(test)
  }
  catch (e) {
    return next(ApiError.badRequest(e.message))
  }
}


export const updateTest = async (req, res, next) => {
  const postId = req.params.id
  const {questions} = req.body

  if(isNaN(Number(postId)) && !Number.isInteger(postId)) {
    return next(ApiError.badRequest('Некорректный id теста(поста)'))
  }

  if(!questions) {
    return next(ApiError.badRequest('Отсутсвуют вопросы'))
  }

  for (let question of questions) {
    if(!question.title) {
      return next(ApiError.badRequest(`Отсутсвует формулировка вопроса в "${question}" вопросе`))
    } else if(question.score === undefined) {
      return next(ApiError.badRequest(`Отсутсвует количество баллов для "${question}" вопроса`))
    } else if(!question.type) {
      return next(ApiError.badRequest(`Отсутсвует тип "${question}" вопроса`))
    } else if(!question.variants) {
      return next(ApiError.badRequest(`Отсутсвуют варианты к "${question}" вопросу`))
    }
    for (let variant of question.variants) {
      if(!variant.title) {
        return next(ApiError.badRequest(`Отсутсвует заголовок "${variant}" варианта к "${question}" вопросу`))
      } else if(variant.is_answer === undefined) {
        return next(ApiError.badRequest(`Отсутсвует правильность "${variant}" варианта к "${question}" вопросу`))
      }
    }
  }

  const test = await Test.findOne({
    where: {
      postId: postId
    }
  })

  if (test === null) {
    return next(ApiError.badRequest('Поста не существует - создайте его'))
  }

  let toDelete = await Question.findAll(
    {where: {testId: test.dataValues.id}}
  )

  let toDeleteVariant
  for (let i in toDelete) {
    toDeleteVariant = await Variant.findAll(
      {where: {questionId: toDelete[i].dataValues.id}}
    )
    for (let j in toDeleteVariant) {
      await Variant.destroy(
        {where: {id: toDeleteVariant[j].dataValues.id}}
      )
    }
    await Question.destroy(
      {where: {id: toDelete[i].dataValues.id}}
    )
  }

  let questionElem;

  for (let question of questions) {
    questionElem = await Question.create(
      {type: question.type, title: question.title, score: question.score, testId: test.dataValues.id}
    )
    for (let variant of question.variants){
      await Variant.create(
        {questionId: questionElem.dataValues.id, title: variant.title, is_answer: variant.is_answer},
      )
    }
  }
  return res.json({questions, testId: test.dataValues.id})
}