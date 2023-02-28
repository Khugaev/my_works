import {
  GET_ALL_USERS_FAIL,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  USER_CHANGE_ROLE_FAIL,
  USER_CHANGE_ROLE_REQUEST,
  USER_CHANGE_ROLE_SUCCESS, USER_DELETE_FAIL, USER_DELETE_REQUEST, USER_DELETE_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS, USER_UPDATE_RESET
} from "../constants/userConstants";

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return {loading: true}
    case USER_REGISTER_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload
      }
    case USER_REGISTER_FAIL:
      return {
        loading: false,
        error: action.payload
      }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {loading: true}
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload
      }
    case USER_LOGIN_FAIL:
      return {
        loading: false,
        error: action.payload
      }
    case USER_LOGOUT:
      return {}
    default:
      return state
  }
}

export const allUsers = (state = {users: []}, action) => {
  switch (action.type) {
    case GET_ALL_USERS_REQUEST:
      return {loading: true}
    case GET_ALL_USERS_SUCCESS:
      return {loading: false, users: action.payload}
    case GET_ALL_USERS_FAIL:
      return {loading: false, error: action.payload}
    default:
      return state
  }
}

export const userUpdateReducer = (state = {user: {}}, action) => {
  switch (action.type) {
    case USER_CHANGE_ROLE_REQUEST:
      return {loading: true}
    case USER_CHANGE_ROLE_SUCCESS:
      return {loading: false, success: action.payload}
    case USER_CHANGE_ROLE_FAIL:
      return {loading: false, error: action.payload}

    case USER_DELETE_REQUEST:
      return {loading: true}
    case USER_DELETE_SUCCESS:
      return {loading: false, success: action.payload}
    case USER_DELETE_FAIL:
      return {loading: false, error: action.payload}

    case USER_UPDATE_RESET:
      return {user: {}}
    default:
      return state
  }
}