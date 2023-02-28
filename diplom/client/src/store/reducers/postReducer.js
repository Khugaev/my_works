import {
  POST_ADD_FAIL,
  POST_ADD_REQUEST,
  POST_ADD_SUCCESS,
  POST_DELETE_FAIL,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS, POST_DIFFERENCES_RESET, POST_EDITOR_CHANGE, POST_EDITOR_TITLE_CHANGE, POST_GET_CHANGE_FAIL,
  POST_GET_CHANGE_REQUEST,
  POST_GET_CHANGE_SUCCESS,
  POST_GET_CHANGES_FAIL, POST_GET_CHANGES_REQUEST,
  POST_GET_CHANGES_SUCCESS,
  POST_GET_FAIL,
  POST_GET_REQUEST,
  POST_GET_SUCCESS,
  POST_SUGGEST_CHANGES_FAIL,
  POST_SUGGEST_CHANGES_REQUEST,
  POST_SUGGEST_CHANGES_SUCCESS,
  POST_TITLE_LIST_FAIL,
  POST_TITLE_LIST_REQUEST,
  POST_TITLE_LIST_SUCCESS,
  POST_UPDATE_CHANGES_FAIL,
  POST_UPDATE_CHANGES_REQUEST,
  POST_UPDATE_CHANGES_SUCCESS
} from "../constants/postConstants";

export const postGetAddReducer = (state = {post: {text: {blocks: []}, title: ''}}, action) => {
  switch (action.type) {
    case POST_GET_REQUEST:
      return {loading: true}
    case POST_GET_SUCCESS:
      return {loading: false, post: action.payload}
    case POST_GET_FAIL:
      return {loading: false, error: action.payload}

    case POST_ADD_REQUEST:
      return {loading: true}
    case POST_ADD_SUCCESS:
      return {loading: false, post: action.payload}
    case POST_ADD_FAIL:
      return {loading: false, error: action.payload}

    case POST_DELETE_REQUEST:
      return {...state, loading: true}
    case POST_DELETE_SUCCESS:
      return {...state, loading: false}
    case POST_DELETE_FAIL:
      return {loading: false, error: action.payload}

    case POST_EDITOR_CHANGE:
      return {...state, post: action.payload}
    case POST_EDITOR_TITLE_CHANGE:
      return {...state,
        post: {...state.post, title: action.payload}
      }

    default:
      return state
  }
}

export const postsTitlesListReducer = (state = {postsTitles: []}, action) => {
  switch (action.type) {
    case POST_TITLE_LIST_REQUEST:
      return {...state, loading: true}
    case POST_TITLE_LIST_SUCCESS:
      return {loading: false, postsTitles: action.payload}
    case POST_TITLE_LIST_FAIL:
      return {loading: false, error: action.payload}
    default:
      return state
  }
}

export const postSuggestChangesReducer = (state = {changes: []}, action) => {
  switch (action.type) {

    case POST_GET_CHANGES_REQUEST:
      return {loading: true}
    case POST_GET_CHANGES_SUCCESS:
      return {loading: false, changes: action.payload}
    case POST_GET_CHANGES_FAIL:
      return {loading: false, error: action.payload}

    default:
      return state
  }
}


export const postSuggestedChangeReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_GET_CHANGE_REQUEST:
      return {loading: true}
    case POST_GET_CHANGE_SUCCESS:
      return {loading: false, post: action.payload}
    case POST_GET_CHANGE_FAIL:
      return {loading: false, error: action.payload}

    case POST_SUGGEST_CHANGES_REQUEST:
      return {loading: true}
    case POST_SUGGEST_CHANGES_SUCCESS:
      return {loading: false, post: action.payload}
    case POST_SUGGEST_CHANGES_FAIL:
      return {loading: false, error: action.payload}

    case POST_UPDATE_CHANGES_REQUEST:
      return {loading: true}
    case POST_UPDATE_CHANGES_SUCCESS:
      return {loading: false, post: action.payload}
    case POST_DIFFERENCES_RESET:
      return {post: {text: {blocks: []}, title: ''}}
    case POST_UPDATE_CHANGES_FAIL:
      return {loading: false, error: action.payload}


    default:
      return state
  }
}
