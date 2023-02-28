import  {applyMiddleware, combineReducers, createStore} from 'redux'
import thunk from "redux-thunk";
import {allUsers, userLoginReducer, userRegisterReducer, userUpdateReducer} from "./reducers/userReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import {
  postGetAddReducer,
  postsTitlesListReducer, postSuggestChangesReducer, postSuggestedChangeReducer
} from "./reducers/postReducer";
import {allResultsReducer, testing, testReducer, testResultReducer} from "./reducers/testReducer";
import {commentInputReducer, getCommentsReducer} from "./reducers/commentsReducer";

const reducers = combineReducers({
  post: postGetAddReducer,
  userRegister: userRegisterReducer,
  userLogin: userLoginReducer,
  userList: allUsers,
  postsTitles: postsTitlesListReducer,
  test: testReducer,
  testResult: testResultReducer,
  allResults: allResultsReducer,
  postChanges: postSuggestChangesReducer,
  commentInput: commentInputReducer,
  commentsGet: getCommentsReducer,
  suggestedPost: postSuggestedChangeReducer,
  userUpdate: userUpdateReducer,
})

const userInfoFromStorage =
  localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) :
    null


const initialState = {
  userLogin: {
    userInfo: userInfoFromStorage
  },
}

const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(thunk)))

export default store