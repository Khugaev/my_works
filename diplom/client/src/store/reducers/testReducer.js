import {
  ALL_RESULTS_RESET,
  RESULT_RESET,
  TEST_ADD_QUESTION,
  TEST_ADD_VARIANT,
  TEST_CHECK_FAIL,
  TEST_CHECK_REQUEST,
  TEST_CHECK_SUCCESS,
  TEST_CREATE_FAIL,
  TEST_CREATE_REQUEST,
  TEST_CREATE_SUCCESS,
  TEST_DELETE_QUESTION,
  TEST_DELETE_VARIANT, TEST_GET_ALL_RESULTS_FAIL, TEST_GET_ALL_RESULTS_REQUEST, TEST_GET_ALL_RESULTS_SUCCESS,
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

export const testReducer = (state = {test: {questions: []}}, action) => {
  /*const newState = JSON.parse(JSON.stringify(state))*/
  let testTemp
  switch (action.type) {
    case TEST_GET_REQUEST:
      return {loading: true}
    case TEST_GET_SUCCESS:
      return {loading: false, test: action.payload}
    case TEST_GET_FAIL:
      return {loading: false, error: action.payload}

    case TEST_CREATE_REQUEST:
      return {loading: true}
    case TEST_CREATE_SUCCESS:
      return {loading: false, test: action.payload}
    case TEST_CREATE_FAIL:
      return {loading: true, error: action.payload}

    case TEST_UPDATE_REQUEST:
      return {loading: true}
    case TEST_UPDATE_SUCCESS:
      return {loading: false, test: action.payload}
    case TEST_UPDATE_FAIL:
      return {loading: true, error: action.payload}

    case TEST_ADD_VARIANT:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions[action.payload.questionId].variants.push(action.payload)
      return testTemp
      /*newState.test.questions[action.payload.questionId].variants.push(action.payload)
      return (newState)*/
    case TEST_DELETE_VARIANT:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions[action.payload.questionId].variants.splice(action.payload.variantId,1)
      return testTemp
    case TEST_ADD_QUESTION:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions.push(action.payload)
      return testTemp
    case TEST_DELETE_QUESTION:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions.splice(action.payload, 1)
      return testTemp

    case TEST_QUESTION_TITLE_CHANGE:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions[action.payload.questionId].title = action.payload.data
      return (testTemp)

    case TEST_VARIANT_TITLE_CHANGE:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions[action.payload.questionId].variants[action.payload.variantId].title = action.payload.data
      return (testTemp)

    case TEST_IS_ANSWER_CHANGE:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions[action.payload.questionId].variants[action.payload.variantId].is_answer =
        !testTemp.test.questions[action.payload.questionId].variants[action.payload.variantId].is_answer
      return (testTemp)

    case TEST_SCORE_CHANGE:
      testTemp = {
        test: {...state.test}
      }
      testTemp.test.questions[action.payload.questionId].score = action.payload.data
      return (testTemp)

    default:
      return state
  }
}

export const testResultReducer = (state = {}, action) => {
  switch (action.type) {
    case TEST_CHECK_REQUEST:
      return {loading: true}
    case TEST_CHECK_SUCCESS:
      return {loading: false, result: action.payload}
    case TEST_CHECK_FAIL:
      return {loading: false, error: action.payload}

    case TEST_GET_RESULT_REQUEST:
      return {loading: true}
    case TEST_GET_RESULT_SUCCESS:
      return {loading: false, result: action.payload}
    case TEST_GET_RESULT_FAIL:
      return {loading: false, error: action.payload}

    case TEST_UPDATE_RESULT_REQUEST:
      return {loading: true}
    case TEST_UPDATE_RESULT_SUCCESS:
      return {loading: false, result: action.payload}
    case TEST_UPDATE_RESULT_FAIL:
      return {loading: false, error: action.payload}

    case RESULT_RESET:
      return {}

    default:
      return state
  }
}

export const allResultsReducer = (state = {results: []}, action) => {
  switch (action.type) {
    case TEST_GET_ALL_RESULTS_REQUEST:
      return {loading: true}
    case TEST_GET_ALL_RESULTS_SUCCESS:
      return {loading: false, results: action.payload}
    case TEST_GET_ALL_RESULTS_FAIL:
      return {loading: false, error: action.payload}

    case ALL_RESULTS_RESET:
      return {}

    default:
      return state
  }
}

export const testing = (state = {}, action) => {
  switch (action.type) {
    case 'TESTING':
      return {title: action.payload}
    default:
      return state
  }
}