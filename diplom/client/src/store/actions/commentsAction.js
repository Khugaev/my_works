import {
  POST_COMMENT_ADD_FAIL,
  POST_COMMENT_ADD_REQUEST,
  POST_COMMENT_ADD_SUCCESS,
  POST_COMMENT_CHANGE, POST_COMMENT_DELETE_FAIL,
  POST_COMMENT_DELETE_REQUEST, POST_COMMENT_DELETE_SUCCESS,
  POST_COMMENT_UPDATE_FAIL,
  POST_COMMENT_UPDATE_REQUEST,
  POST_COMMENT_UPDATE_SUCCESS,
  POST_COMMENTS_GET_FAIL,
  POST_COMMENTS_GET_REQUEST,
  POST_COMMENTS_GET_SUCCESS,
  POST_REPLIES_GET_FAIL,
  POST_REPLIES_GET_REQUEST,
  POST_REPLIES_GET_SUCCESS
} from "../constants/commentsConstants";
import axios from "axios";

export const postCommentChange = (text) => {
  return {
    type: POST_COMMENT_CHANGE,
    payload: text
  }
}


export const postAddComment = (text, postId, parentId = 0) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_COMMENT_ADD_REQUEST
    })

    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.post(`/api/post/comments`,
      {text: text, postId: postId, parentId: parentId},
      config)

    data.name = userInfo.name

    dispatch({
      type: POST_COMMENT_ADD_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_COMMENT_ADD_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const postGetComments = (postId, offset = 0) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_COMMENTS_GET_REQUEST
    })

    const config = {
      params: {
        postId: postId,
        offset: offset
      }
    }

    const {data} = await axios.get(`/api/post/comments`, config)

    dispatch({
      type: POST_COMMENTS_GET_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_COMMENTS_GET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const postUpdateComment = (newText, commentId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_COMMENT_UPDATE_REQUEST
    })

    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.put(`/api/post/comments`,
      {newText: newText,
        commentId: commentId
      }, config)

    dispatch({
      type: POST_COMMENT_UPDATE_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: POST_COMMENT_UPDATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const postDeleteComment = (postId, commentId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_COMMENT_DELETE_REQUEST
    })

    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      },
      data: {
        commentId: commentId
      }
    }

    await axios.delete(`/api/post/comments`, config)

    dispatch({
      type: POST_COMMENT_DELETE_SUCCESS,
      payload: commentId
    })

  } catch (error) {
    dispatch({
      type: POST_COMMENT_DELETE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const postGetRepliesOfComment = (postId, commentId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_REPLIES_GET_REQUEST
    })

    const config = {
      params: {
        postId: postId,
        commentId: commentId
      }
    }

    const {data} = await axios.get(`/api/post/comments`, config)

    dispatch({
      type: POST_REPLIES_GET_SUCCESS,
      payload: {data, commentId}
    })
  } catch (error) {
    dispatch({
      type: POST_REPLIES_GET_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}