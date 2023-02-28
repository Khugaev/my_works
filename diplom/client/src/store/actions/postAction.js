import {
  POST_ADD_FAIL,
  POST_ADD_REQUEST,
  POST_ADD_SUCCESS,
  POST_DELETE_FAIL,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS, POST_DIFFERENCES_RESET, POST_EDITOR_CHANGE, POST_EDITOR_TITLE_CHANGE, POST_GET_CHANGE_FAIL,
  POST_GET_CHANGE_REQUEST, POST_GET_CHANGE_SUCCESS,
  POST_GET_CHANGES_FAIL,
  POST_GET_CHANGES_REQUEST,
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
import axios from "axios";

export const addPost = (title, post) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_ADD_REQUEST
    })
    /*console.log(await editorCore.current.save())*/
    console.log(post)
    const postText = JSON.stringify(post.text)
    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const titles = (await axios.get('/api/post', config)).data
    const postToUpdate = titles.find(t => t.title === title)
    let data

    if (postToUpdate) {
      if (window.confirm(`Заменить запись ${title}?`)) {
        data = (await axios.put('/api/post',
          {postId: postToUpdate.id, post: {title, postText}}, config)).data
        console.log(data)
      }
    } else {
      data = (await axios.post('/api/post',
        {title, postText, authorId: userInfo._id}, config)).data
      data.text = JSON.parse(data.text)
    }

    dispatch({
      type: POST_ADD_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_ADD_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const fetchPost = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_GET_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const {data} = await axios.get(`/api/post/${id}`, config)

    const {postsTitles: {postsTitles}} = getState()
    const post = postsTitles.filter((post) => post.id === data.id)[0]

    localStorage.setItem('initialPost', JSON.stringify(post))

    dispatch({
      type: POST_GET_SUCCESS,
      payload: data
    })
  } catch (error) {
    console.log(error.response.data.message)
    if (error.response && error.response.data.message === 'Пост не найден') {
      dispatch({
        type: POST_GET_SUCCESS,
        payload: {text: {blocks: []}, title: ''}
      })
    } else {
      dispatch({
        type: POST_GET_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message
      })
    }

  }
}

export const deletePostAction = (postId) => async (dispatch, getState) => {
  // сделать чтобы каждый мог удалять только свои посты
  // созданные самими
  try {
    dispatch({
      type: POST_DELETE_REQUEST
    })

    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      },
      params: {
        postId: postId
      }
    }
    const {data} = await axios.delete(`/api/post`, config)

    const {postsTitles: {postsTitles}} = getState()
    console.log(postsTitles)
    console.log(postId)
    /*let i = 0
    while (postsTitles[i].id !== postId) i++

    if (i !== postsTitles.length) {
      await dispatch(fetchPost(i - 1))
    }

    for (let post of postsTitles) {
      if (post.id === postId) {
      }
    }*/

    const currentPost = postsTitles.findIndex((p, index) => p.id === postId)
    console.log(currentPost)
    if (currentPost !== -1) {
      console.log(currentPost)
      if (currentPost+1 !== postsTitles.length) {
        console.log(postsTitles[currentPost+1].id)
        await dispatch(fetchPost(postsTitles[currentPost+1].id))
      } if (currentPost === 0) {
        await dispatch(fetchPost(postsTitles[1].id))
      }
      else {
        dispatch(fetchPost(postsTitles[currentPost-1].id))
      }
    }

    dispatch({
      type: POST_DELETE_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_DELETE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


export const listPostsTitles = () => async (dispatch) => {
  try {
    dispatch({
      type: POST_TITLE_LIST_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const {data} = await axios.get('/api/post', config)


    dispatch({
      type: POST_TITLE_LIST_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_TITLE_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const suggestChangesAction = (postId, post) => async (dispatch, getState) => {
  const postText = JSON.stringify(post.text)
  console.log(postText)
  const {userLogin: {userInfo}} = getState()
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`
    }
  }
  console.log(config)

  const existingChanges = (await axios.get(`/api/postedit/${postId}`, config)).data
  console.log(existingChanges)

  if (existingChanges) {
    dispatch(updateChangesAction(postId, post))
  }
  else {
    try {
      dispatch({
        type: POST_SUGGEST_CHANGES_REQUEST
      })


      const {data} = await axios.post('/api/postedit',
        {newText: postText, postId: postId, authorId: userInfo._id},
        config)
      console.log(data)
      data.text = JSON.parse(data.text)

      dispatch({
        type: POST_SUGGEST_CHANGES_SUCCESS,
        payload: data
      })
    } catch (error) {
      dispatch({
        type: POST_SUGGEST_CHANGES_FAIL,
        payload: error.response && error.response.data.message ? error.response.data.message : error.message
      })
    }
  }
}


export const getChangesAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_GET_CHANGES_REQUEST
    })
    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.get('/api/postedit', config)

    dispatch({
      type: POST_GET_CHANGES_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_GET_CHANGES_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const getChangeAction = (postId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_GET_CHANGE_REQUEST
    })
    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.get(`/api/postedit/${postId}`, config)
    console.log(data)
    dispatch({
      type: POST_GET_CHANGE_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_GET_CHANGE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}


export const getChangeActionAdmin = (postId, userId) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_GET_CHANGE_REQUEST
    })
    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.get(`/api/postedit/${postId}/${userId}`, config)

    dispatch({
      type: POST_GET_CHANGE_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_GET_CHANGE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}

export const updateChangesAction = (postId, post) => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_UPDATE_CHANGES_REQUEST
    })
    const postText = JSON.stringify(post.text)
    const {userLogin: {userInfo}} = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const {data} = await axios.put(`/api/postedit/${postId}`,
      {newText: postText, authorId: userInfo._id},
      config)
    console.log(data)
    data.text = JSON.parse(data.text)

    dispatch({
      type: POST_UPDATE_CHANGES_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: POST_UPDATE_CHANGES_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}



export const resetDifferencesAction = () => {
  return {
    type: POST_DIFFERENCES_RESET
  }
}

export const postEditorChange = (text) => {
  return {
    type: POST_EDITOR_CHANGE,
    payload: text
  }
}

export const postEditorTitleChange = (title) => {
  return {
    type: POST_EDITOR_TITLE_CHANGE,
    payload: title
  }
}