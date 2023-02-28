import {
  TEST_ADD_QUESTION,
  TEST_ADD_VARIANT,
  TEST_CHECK_FAIL,
  TEST_CHECK_REQUEST,
  TEST_CHECK_SUCCESS,
  TEST_CREATE_FAIL,
  TEST_CREATE_REQUEST,
  TEST_CREATE_SUCCESS,
  TEST_DELETE_QUESTION,
  TEST_DELETE_VARIANT, TEST_GET_ALL_RESULTS_FAIL,
  TEST_GET_ALL_RESULTS_REQUEST,
  TEST_GET_ALL_RESULTS_SUCCESS,
  TEST_GET_FAIL,
  TEST_GET_REQUEST,
  TEST_GET_RESULT_FAIL,
  TEST_GET_RESULT_REQUEST,
  TEST_GET_RESULT_SUCCESS,
  TEST_GET_SUCCESS,
  TEST_INPUT_CHANGE,
  TEST_IS_ANSWER_CHANGE,
  TEST_QUESTION_TITLE_CHANGE,
  TEST_SCORE_CHANGE,
  TEST_UPDATE_FAIL,
  TEST_UPDATE_REQUEST,
  TEST_UPDATE_RESULT_FAIL,
  TEST_UPDATE_RESULT_REQUEST,
  TEST_UPDATE_RESULT_SUCCESS,
  TEST_UPDATE_SUCCESS,
  TEST_VARIANT_TITLE_CHANGE
} from "../constants/testConstants";
import axios from "axios";

export const getTest = (postId) => async (dispatch) => {
  try {
    dispatch({
      type: TEST_GET_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const {data} = await axios.get(`/api/test/${postId}`, config)


    dispatch({
      type: TEST_GET_SUCCESS,
      payload: data
    })

  } catch (error) {
    console.log(error.response.data.message)
    if (error.response && (error.response.data.message.error === 'TEST_NOT_EXIST')) {
      console.log(error)
      dispatch({
        type: TEST_GET_SUCCESS,
        payload: {questions: []}
      })
    }
    else {
      dispatch({
        type: TEST_GET_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message
      })
    }
  }
}

export const checkTest = (testId, answers) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TEST_CHECK_REQUEST
    })

    const { userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.post(`/api/test/${testId}`, {userId: userInfo._id, answers: answers}, config)

    dispatch({
      type: TEST_CHECK_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: TEST_CHECK_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const getResult = (postId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TEST_GET_RESULT_REQUEST
    })

    const { userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      },
      params: {
        userId: userInfo._id
      }
    }

    const {data} = await axios.get(`/api/result/${postId}`, config)
    dispatch({
      type: TEST_GET_RESULT_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: TEST_GET_RESULT_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const getResults = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TEST_GET_ALL_RESULTS_REQUEST
    })

    const { userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      },
      params: {
        userId: userInfo._id
      }
    }

    const {data} = await axios.get('/api/result/', config)

    dispatch({
      type: TEST_GET_ALL_RESULTS_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: TEST_GET_ALL_RESULTS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const updateResult = (postId, answers) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TEST_UPDATE_RESULT_REQUEST
    })

    const { userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.put(`/api/result/${postId}`, {userId: userInfo._id, answers: answers}, config)

    dispatch({
      type: TEST_UPDATE_RESULT_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: TEST_UPDATE_RESULT_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const createTest = (postId, questions) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TEST_CREATE_REQUEST
    })

    const { userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    console.log('TEXT lflsdjflkdjslfskjd')
    const {data} = await axios.post('/api/test', {userId: userInfo._id, postId, questions}, config)

    dispatch({
      type: TEST_CREATE_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: TEST_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const updateTest = (postId, questions) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TEST_UPDATE_REQUEST
    })

    const { userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.put(`/api/test/${postId}`, {userId: userInfo._id, questions}, config)

    dispatch({
      type: TEST_UPDATE_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: TEST_UPDATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const addVariant = (data) => {
  return ({
    type: TEST_ADD_VARIANT,
    payload: data
  })
}

export const deleteVariant = (data) => {
  return ({
    type: TEST_DELETE_VARIANT,
    payload: data
  })
}

export const addQuestion = (data) => {
  return ({
    type: TEST_ADD_QUESTION,
    payload: data
  })
}

export const deleteQuestion = (data) => {
  return ({
    type: TEST_DELETE_QUESTION,
    payload: data
  })
}

export const onQuestionTitleChange = (questionId, data) => {
  return ({
    type: TEST_QUESTION_TITLE_CHANGE,
    payload: {questionId, data}
  })
}

export const onVariantTitleChange = (questionId, variantId, data) => {
  return ({
    type: TEST_VARIANT_TITLE_CHANGE,
    payload: {questionId, variantId, data}
  })
}

export const onScoreChange = (questionId, data) => {
  return ({
    type: TEST_SCORE_CHANGE,
    payload: {questionId, data}
  })
}

export const onIsAnswerChange = (questionId, variantId) => {
  return ({
    type: TEST_IS_ANSWER_CHANGE,
    payload: {questionId, variantId}
    })
}

export const testingAction = (title = 'testing') => {
  return ({
    type: 'TESTING',
    payload: title
  })
}