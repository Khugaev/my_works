import {
  POST_COMMENT_ADD_FAIL,
  POST_COMMENT_ADD_REQUEST,
  POST_COMMENT_ADD_SUCCESS,
  POST_COMMENT_CHANGE,
  POST_COMMENTS_GET_FAIL,
  POST_COMMENTS_GET_REQUEST,
  POST_COMMENTS_GET_SUCCESS,
  POST_REPLIES_GET_REQUEST,
  POST_REPLIES_GET_SUCCESS,
  POST_REPLIES_GET_FAIL,
  POST_COMMENT_UPDATE_REQUEST,
  POST_COMMENT_UPDATE_SUCCESS,
  POST_COMMENT_UPDATE_FAIL,
  POST_COMMENT_DELETE_SUCCESS, POST_COMMENT_DELETE_FAIL, POST_COMMENT_DELETE_REQUEST
} from "../constants/commentsConstants";

function insertReply(comment, item) {
  let len = comment.length;
  for (let i = 0; i < len; i++) {
    if (comment[i].id === item.parentId) {
      if (!comment[i].replies) {
        comment[i].replies = []
      }
      comment[i].replies.push(item)
      return true
    }
  }
  for (let i = 0; i < len; i++) {
    if (comment[i].replies) {
      insertReply(comment[i].replies, item)
    }
  }
}

function replaceComment(comment, item) {
  let len = comment.length;
  for (let i = 0; i < len; i++) {
    if (comment[i].id === item.id) {
      if (comment[i].deleted) comment[i].deleted = false
      comment[i].text = item.text
      comment[i].updatedAt = item.updatedAt
      return true
    }
  }
  for (let i = 0; i < len; i++) {
    if (comment[i].replies) {
      replaceComment(comment[i].replies, item)
    }
  }
}


function insertReplies(comment, items, postId) {
  let len = comment.length;
  for (let i = 0; i < len; i++) {
    if (comment[i].id === postId) {
      comment[i].replies = items
      return true
    }
  }
  for (let i = 0; i < len; i++) {
    if (comment[i].replies) {
      insertReplies(comment[i].replies, items, postId)
    }
  }
}

function deleteComment(comment, item) {
  let len = comment.length;
  for (let i = 0; i < len; i++) {
    if (comment[i].id === item) {
      comment[i].text = 'Комментарий был удален'
      comment[i].deleted = true
      return true
    }
  }
  for (let i = 0; i < len; i++) {
    if (comment[i].replies) {
      deleteComment(comment[i].replies, item)
    }
  }
}


export const commentInputReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_COMMENT_CHANGE:
      return {text: action.payload}

    default:
      return state
  }
}

export const getCommentsReducer = (state = {comments: []}, action) => {
  switch (action.type) {
    case POST_COMMENTS_GET_REQUEST:
      return {...state, loading: true}
    case POST_COMMENTS_GET_SUCCESS:
      return {loading: false,
        comments: action.payload.comments,
        offset: action.payload.commentsToShowCount,
        commentsCount: action.payload.count
      }
    case POST_COMMENTS_GET_FAIL:
      return {loading: false, error: action.payload}

    case POST_COMMENT_ADD_REQUEST:
      return {...state, addLoading: true}
    case POST_COMMENT_ADD_SUCCESS: {
      const comments = [...state.comments]
      const newComment = action.payload
      if (newComment.parentId === 0) {
        comments.push(newComment)
      } else {
        insertReply(comments, action.payload)
      }
      return {
        ...state,
        getRepliesLoading: false,
        comments: comments
      }
    }
    case POST_COMMENT_ADD_FAIL:
      return {addLoading: false, error: action.payload}

    case POST_REPLIES_GET_REQUEST:
      return {...state, getRepliesLoading: true}
    case POST_REPLIES_GET_SUCCESS: {
      const comments = [...state.comments]
      const replies = action.payload.data
      const commentId = action.payload.commentId

      insertReplies(comments, replies, commentId)

      return {
        ...state,
        addLoading: false,
        comments: comments
      }
    }
    case POST_REPLIES_GET_FAIL:
      return {getRepliesLoading: false, error: action.payload}

    // update
    case POST_COMMENT_UPDATE_REQUEST:
      return {...state, updateLoading: true}
    case POST_COMMENT_UPDATE_SUCCESS: {
      const comments = [...state.comments]
      const updatedComment = action.payload
      replaceComment(comments, updatedComment)
      return {...state, updateLoading: true, comments: comments}
    }
    case POST_COMMENT_UPDATE_FAIL:
      return {updateLoading: false, error: action.payload}


    case POST_COMMENT_DELETE_REQUEST:
      return {...state, deleteLoading: false}
    case POST_COMMENT_DELETE_SUCCESS: {
      const comments = [...state.comments]
      const commentId = action.payload
      deleteComment(comments, commentId)
      return {...state, deleteLoading: true, comments: comments}
    }

    case POST_COMMENT_DELETE_FAIL:
      return {updateLoading: false, error: action.payload}



    default:
      return state
  }
}