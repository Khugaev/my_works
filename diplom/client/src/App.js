import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PostScreen from "./screens/PostScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Header from "./components/Header";
import {Container} from "react-bootstrap";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AdminPostScreen from "./screens/AdminPostScreen";
import {useDispatch, useSelector} from "react-redux";
import PostChangesScreen from "./screens/PostChangesScreen";
import SuggestedChangeScreen from "./screens/SuggestedChangeScreen";
import UsersAdminScreen from "./screens/UsersAdminScreen";
import {useEffect} from "react";
import {fetchPost, listPostsTitles} from "./store/actions/postAction";
import {getResult, getTest} from "./store/actions/testAction";
import {postGetComments} from "./store/actions/commentsAction";

function App() {
  const {userInfo} = useSelector(state => state.userLogin)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(listPostsTitles())
    if (localStorage.getItem('initialPost') /* ЭТО УБРАТЬ В КОНЦЕ */ &&  localStorage.getItem('initialPost') !== 'undefined') {
      const initialPost = JSON.parse(localStorage.getItem('initialPost'))
      dispatch(fetchPost(initialPost.id))
      dispatch(getResult(initialPost.testId))
      dispatch(getTest(initialPost.id))
      dispatch(postGetComments(initialPost.id))
    }
  }, [dispatch])
  return (
    <BrowserRouter>
      <Header/>
      <main className='main'>
        <Container className='main-container'>
          <Routes>
            {userInfo && (
              <>
                <Route path="profile" element={<ProfileScreen/>} exact/>
              </>
            )}

            {userInfo && userInfo.role === 'ADMIN' && (
              <>
                <Route path="profile" element={<ProfileScreen/>} exact/>
                <Route path="/admin/userlist" element={<UsersAdminScreen/>} exact/>
                <Route path="/admin/post" element={<AdminPostScreen/>} exact/>
                <Route path="/admin/post/suggested_changes" element={<SuggestedChangeScreen/>} exact/>
              </>
            )}

            <Route path="post" element={<PostScreen/>} exact/>
            <Route path="/login" element={<LoginScreen/>} exact/>
            <Route path="/register" element={<RegisterScreen/>} exact/>
            <Route path="/edit_post" element={<PostChangesScreen/>} exact/>
            <Route path="/*" element={<Navigate replace to='/post'/>}/>
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}

export default App;
