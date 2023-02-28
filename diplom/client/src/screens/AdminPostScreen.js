import React, {useEffect} from 'react';
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import SideBar from "../components/SideBar/SideBar";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  addPost,
  deletePostAction,
  listPostsTitles,
  postEditorTitleChange
} from "../store/actions/postAction";
import Test from "../components/Admin/Test";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {TEST_NOT_EXIST} from "../utils/errorCodes";
import Editor from "../components/Editor";

const AdminPostScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const postText = useSelector(state => state.post.post)
  const userInfo = useSelector(state => state.userLogin.userInfo)

  const postLoading = useSelector(state => state.post.loading)
  const postError = useSelector(state => state.post.error)
  const {loading, error} = useSelector(state => state.test)

  useEffect(() => {
    if (userInfo && userInfo.role === 'ADMIN') {
    } else {
      navigate('/', {replace: true})
    }
  }, [navigate, userInfo])


  async function savePost() {
    await dispatch(addPost(postText.title, postText))
    dispatch(listPostsTitles())
  }

  const errorHandler = () => {
    if (error) {
      if (error.error === TEST_NOT_EXIST.error) {
        return <Test/>
      } else {
        return <Message variant='info'>{error.message}</Message>
      }
    } else {
      return <Test/>
    }
  }
  function deletePost() {
    if (Object.keys(JSON.parse(JSON.stringify(postText))).length !== 0) {
      if (window.confirm('Удалить запись?')) {
        dispatch(deletePostAction(postText.id))
        dispatch(listPostsTitles())
      }
    } else {
      alert('Выберите пост для удаления')
    }
  }

  return (
    <Row>
      <Col md={8} className='py-3'>
        {postLoading ? <Loader/> : postError ? <Message variant='danger'>{postError}</Message> : (<>
          Редактор текста

          <InputGroup className="mb-3">
            <InputGroup.Text id="title">Название поста:</InputGroup.Text>
            <Form.Control
              aria-label="title"
              aria-describedby="title"
              value={postText.title}
              onChange={e => dispatch(postEditorTitleChange(e.target.value))}
            />
          </InputGroup>
          <Editor data={postText}/>

          <div className='admin-post__buttons'>
            <Button variant="success" onClick={savePost}>Сохранить пост</Button>
            <Button variant="danger" onClick={deletePost}>Удалить пост</Button>
          </div>

          {loading === true ? <Loader/> : errorHandler()}
        </>)}

      </Col>
      <Col md={4} className='sidebar py-3'>
        <SideBar/>
      </Col>
    </Row>
  );
};

export default AdminPostScreen;