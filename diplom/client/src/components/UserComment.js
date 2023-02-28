/*
import React, {useState} from 'react';
import CommentForm from "./CommentForm";
import {createCommentHierarchy} from "./UsersComments";
import {useSelector} from "react-redux";

const UserComment = (props) => {
  const comment = props.comment
  const [show, setShow] = useState(false)
  const userInfo = useSelector(state => state.userLogin.userInfo)
  console.log(comment.id)
  return (
    <li key={comment.id} className='post-comment__content'>
      <div className='post-comment'>
        <div className='post-comment_username'>{comment.name}</div>
        <time className='post-comment_date' dateTime={comment.updatedAt}>{comment.updatedAt}</time>
        {comment.text}
        {console.log(userInfo)}
        {userInfo && (
          <div className='post-comment__reply'
               onClick={() => {setShow(!show)}}
          >
            Ответить
          </div>
        )}

        {show && <CommentForm parentId={comment.id}/>}

      </div>
      {createCommentHierarchy(comment.children)}
    </li>
  )
};

export default UserComment;*/
