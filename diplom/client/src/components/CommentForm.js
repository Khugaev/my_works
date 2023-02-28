import React, {useState} from 'react';
import {Button, Form} from "react-bootstrap";
import {postAddComment, postUpdateComment} from "../store/actions/commentsAction";
import {useDispatch, useSelector} from "react-redux";

const CommentForm = ({commentId, initialValue = '', editMode=false, setEditMode=null}) => {
  const postId = useSelector(state => state.post.post.id)
  const dispatch = useDispatch()

  const [commentText, setCommentText] = useState('')

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (editMode) {
      dispatch(postUpdateComment(commentText, commentId))
    } else {
      dispatch(postAddComment(commentText, postId, commentId))
    }
  }

  return (
    <Form className='comment-form'>
      <Form.Group>
        <Form.Control type="text"
                      placeholder="Оставьте комментарий"
                      defaultValue={initialValue}
                      onChange={(e) => setCommentText(e.target.value)/*dispatch(postCommentChange(e.target.value))*/}
        />
      </Form.Group>

      <div className='comment-form__buttons'>
        {editMode &&
          <Button variant="outline-secondary"
                  type="reset"
                  className='comment-form__button'
                  onClick={() => {setEditMode(false)}}

          >
            Отменить
          </Button>}

        <Button variant="primary"
                type="submit"
                className='comment-form__button'
                onClick={onSubmitHandler}
        >
          {editMode ? 'Сохранить' : 'Отправить'}
        </Button>
      </div>
    </Form>
  );
};

export default CommentForm;