import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CommentForm from "./CommentForm";
import {postDeleteComment, postGetComments} from "../store/actions/commentsAction";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faXmark} from "@fortawesome/free-solid-svg-icons";


const UsersComments = () => {
  const comments = useSelector(state => state.commentsGet)
  const postId = useSelector(state => state.post.post.id)

  const dispatch = useDispatch()

  function Comment({ comment, parentName, depth }) {
    let [show, setShow] = useState(false)
    let [editMode, setEditMode] = useState(false)
    const userInfo = useSelector(state => state.userLogin.userInfo)

    const handleEditMode = (mode) => {
      setEditMode(mode)
    }

    return (
      <li className='post-comment__content'>
        <div className='post-comment'>
          <div className='post-comment_username'>{comment.name}</div>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <time className='post-comment_date' dateTime={comment.updatedAt}>{comment.updatedAt}</time>
            {(userInfo && (comment.userId === userInfo._id)) &&
              (<div>
                <FontAwesomeIcon
                style={{cursor: "pointer"}}
                onClick={() => setEditMode(!editMode)}
                icon={faPenToSquare}
                />
                <FontAwesomeIcon
                  style={{cursor: "pointer", marginLeft: '10px'}}
                  onClick={() => dispatch(postDeleteComment(postId, comment.id))}
                  icon={faXmark}
                />
              </div>)
            }

          </div>
          {editMode ? (<>
              <CommentForm
                commentId={comment.id}
                initialValue={comment.text}
                editMode={editMode}
                setEditMode={handleEditMode}
              />
            </>
          ) : (<>
            <div className={comment.deleted && 'comment__deleted'}>{comment.text}</div>
            {userInfo && (
              <div className='post-comment__reply'
                   onClick={() => {setShow(!show)}}
              >
                Ответить
              </div>
            )}

            {show && <CommentForm commentId={comment.id}/>}
          </>)}


        </div>
        {comment.replies &&
        comment.replies.map((reply) => {
            return (
              <ul key={reply.id} className='comments'>
                <Comment comment={reply} depth={depth+1}/>
              </ul>
            )
        })}
      </li>
    );
  }

  return (
    <div className='comments-list'>
      <ul className='comments'>
      {comments.comments.map((comment) => (
        <Comment key={comment.id} comment={comment}/>
      ))}
      </ul>
      {(comments.commentsCount > comments.offset) && (
        <div onClick={() => dispatch(postGetComments(postId, comments.offset + 10))}>
          Загрузить еще
        </div>
      )
      }

    </div>
  );
};

export default UsersComments;
