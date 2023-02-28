import React, {useContext, useEffect} from 'react';
import styles from './sidebar.module.css'
import {Container, ListGroup, ListGroupItem} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchPost,
  getChangeAction,
  listPostsTitles,
  postEditorTitleChange,
  resetDifferencesAction
} from "../../store/actions/postAction";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {getResult, getTest, testing, testingAction} from "../../store/actions/testAction";
import {postGetComments} from "../../store/actions/commentsAction";

const SideBar = () => {

  const dispatch = useDispatch()
  const location = useLocation()
  console.log(location)

  const postsTitlesState = useSelector(state => state.postsTitles)
  const {postsTitles} = postsTitlesState

  /*useEffect(() => {
    dispatch(listPostsTitles())
    if (localStorage.getItem('initialPost') /!* ЭТО УБРАТЬ В КОНЦЕ *!/ &&  localStorage.getItem('initialPost') !== 'undefined') {
      const initialPost = JSON.parse(localStorage.getItem('initialPost'))
      dispatch(fetchPost(initialPost.id))
      dispatch(getResult(initialPost.testId))
      dispatch(getTest(initialPost.id))
      dispatch(postGetComments(initialPost.id))
    }
    /!*async function initialization() {
      await dispatch(listPostsTitles())
      const firstPostId = Object.keys(postsTitles)
      await dispatch(fetchPost(firstPostId))
      await dispatch(getResult(firstPostId))
      await dispatch(getTest(firstPostId))
    }
    initialization()*!/
  }, [dispatch])*/

  /*const postsTitles = useSelector(state => state.postsTitles.postsTitles)

  const titles = postsTitles.map(post => {
      return (
        {id: post.id,
        title: post.title}
      )
    }
  )*/

  return (
    <>
      <h3>Темы</h3>
      <ol className={styles.postsList}>
        {postsTitles && postsTitles.map(postTitle => (
          <li className='sidebar__post-item' onClick={async () => {
            dispatch(resetDifferencesAction())
            await dispatch(fetchPost(postTitle.id))
            await dispatch(getResult(postTitle.testId))
            await dispatch(getTest(postTitle.id))
            await dispatch(postGetComments(postTitle.id))
            if (location.pathname === '/admin/post') {
              dispatch(postEditorTitleChange(postTitle.title))
            }
            if (location.pathname === '/edit_post') {
              await dispatch(getChangeAction(postTitle.id))
            }
          }}
          key={postTitle.id}
          id={postTitle.id}>
          {postTitle.title}
        </li>))}
      </ol>
    </>
  );
};

export default SideBar;