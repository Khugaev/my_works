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
import axios from "axios";
import {RESULT_RESET} from "../constants/testConstants";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const {data} = await axios.post('/api/user/login', {email, password}, config)
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const registerUser = (name, email, password) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }

    const {data} = await axios.post('/api/user', {name, email, password}, config)

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const getAllUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: GET_ALL_USERS_REQUEST
    })

    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.get('/api/user', config)

    dispatch({
      type: GET_ALL_USERS_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: GET_ALL_USERS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const changeRole = (userId, role) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_CHANGE_ROLE_REQUEST
    })
    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.put('/api/user/change_role',
      {userId, role},
      config)

    dispatch({
      type: USER_CHANGE_ROLE_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: USER_CHANGE_ROLE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST
    })

    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      },
      params: {
        userId
      }
    }

    const {data} = await axios.delete('/api/user', config)

    dispatch({
      type: USER_DELETE_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const userLogout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({type: USER_LOGOUT})
  dispatch({type: RESULT_RESET})
  dispatch({type: USER_UPDATE_RESET})
}

