import {Button, Col, Row} from "react-bootstrap";
import SideBar from "../components/SideBar/SideBar";
import '../style.css'
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../components/Loader";
import {suggestChangesAction} from "../store/actions/postAction";
import PostsDifference from "../components/PostsDifference";
import Editor from "../components/Editor";

const PostChangesScreen = () => {

  const dispatch = useDispatch()

  const post = useSelector(state => state.post.post)

  const postLoading = useSelector(state => state.post.loading)

  const postEdited = useSelector(state => state.suggestedPost.post)
  const loading = useSelector(state => state.suggestedPost)
  async function sendChanges() {
    await dispatch(suggestChangesAction(post.id, post))
  }

  return (
    <Row>
      {loading === true || postLoading ? <Loader/> : (
        <>
          <Col md={8} className='py-3'>

            <Editor data={post}/>

            <Button type='button'
                    variant='outline-primary'
                    onClick={sendChanges}
            >
              Отправить изменения
            </Button>
            {postEdited && postEdited.text.blocks.length ?
              <>
                <h5>Предыдущее предложение</h5>
                <PostsDifference previousPostBlocks={post.text.blocks} newPostBlocks={postEdited.text.blocks}/>
              </> :
              <></>
            }
          </Col>
          <Col md={4} className='sidebar py-3'>
            <SideBar/>
          </Col>
        </>
      )}
    </Row>
  )
}

export default PostChangesScreen