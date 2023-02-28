import React from 'react';
import {Button, Form} from "react-bootstrap";
import s from './Variant.module.css'
import {deleteVariant, onIsAnswerChange, onVariantTitleChange} from "../../store/actions/testAction";
import {useDispatch, useSelector} from "react-redux";

const Variant = ({questionId, variantId}) => {
    const {type} = useSelector(state => state.test.test.questions[questionId])
    const {is_answer, title} = useSelector(state => state.test.test.questions[questionId].variants[variantId])
    const dispatch = useDispatch()

  const removeVariantHandle = (questionId, variantId) => {
    dispatch(deleteVariant({
      questionId: questionId,
      variantId: variantId
    }))
  }

    return (
        <div className={s.variant}>
          <Button className={s.deleteButton} variant="danger" onClick={() => removeVariantHandle(questionId, variantId)}>Удалить вариант</Button>

          <Form.Control
                name={questionId}
                type="text"
                id={variantId}
                value={title}
                onChange={(e) => dispatch(onVariantTitleChange(questionId, variantId, e.target.value))}
            />
            <Form.Check
              name={questionId}
              id={variantId}
              className={s.isAnswerCheckbox}
              type={type}
              onChange={() => dispatch(onIsAnswerChange(questionId, variantId))}
              checked={is_answer}
            />
        </div>

    );
}

export default Variant;
