import {Col, Row} from "react-bootstrap";
import SideBar from "../components/SideBar/SideBar";
import '../style.css'
import {convertDataToHtml} from "../utils/tools";
import React from "react";
import {useSelector} from "react-redux";
import Parser from 'html-react-parser'
import Test from "../components/Test";
import Loader from "../components/Loader";
import {Link} from "react-router-dom";
import Comments from "../components/Comments";

const PostScreen = () => {

  const post = useSelector(state => state.post.post)
  const postLoading = useSelector(state => state.post.loading)
  const testLoading = useSelector(state => state.test.loading)

  return (
    <Row>
      <Col md={8} className='py-3'>
        {postLoading ? <Loader/> : <>
          {Parser(convertDataToHtml(post.text.blocks))}
          <Link to='/edit_post'>
            Добавить правку
          </Link>

          {testLoading !== false ? <Loader/> : <Test/>}

          <Comments/>
        </>}
      </Col>
      <Col md={4} className='sidebar py-3'>
        <SideBar/>
      </Col>
    </Row>
  )
}

export default PostScreen