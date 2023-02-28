import React from 'react';
import Variant from "./Variant";
import s from './Question.module.css'
import {Button, Form} from "react-bootstrap";
import {useState} from "react";
import {
    addVariant,
    deleteQuestion,
    onQuestionTitleChange, onScoreChange
} from "../../store/actions/testAction";
import {useDispatch, useSelector} from "react-redux";

const Question = (props) => {
    const questionId = props.questionId // variantsName
    const {questions} = useSelector(state => state.test.test)
    const {loading} = useSelector(state => state.test)

    const dispatch = useDispatch()

    const [variantId, setVariantId] = useState(questions[questionId].variants.length-1)

    const addVariantHandle = () => {
        dispatch(addVariant({
              title: '',
              type: questions[questionId].type,
              questionId: questionId,
              is_answer: false
        }))
        setVariantId(variantId + 1)
    }

    const removeQuestionHandle = (id) => {
        dispatch(deleteQuestion(id))
    }
    
    return (
        <div className={s.question}>
            {!loading &&(<>
            <p>Вопрос</p>
            <Form.Control
                id={questionId}
                className={s.questionTitle}
                value={questions[questionId].title}
                onChange={(e) => dispatch(onQuestionTitleChange(questionId, e.target.value))}
            />
            <div className={s.variants}>
                <div className={s.variantExplanations}>
                    <p>Варианты</p>
                    <p className={s.trueVariantString}>Правильный вариант</p>
                </div>
                {questions[questionId].variants.map((v, index) => <Variant questionId={questionId} variantId={index} key={index}/>)}
                <div className={s.scoreWrapper}>
                    <p className={s.scoreString}>Баллы: </p>
                    <Form.Control
                      value={questions[questionId].score}
                      onChange={(e) => dispatch(onScoreChange(questionId, e.target.value))}
                      id={questionId}
                      className={s.scoreInput}
                      type={'number'}
                    />
                </div>
                <div className={s.buttons}>
                    <Button variant="secondary" onClick={addVariantHandle}>Добавить вариант</Button>
                    <Button className={s.deleteQuestion} variant="danger" onClick={() => removeQuestionHandle(questionId)}>Удалить вопрос</Button>

                </div>
            </div></>)}
        </div>
    );
}
export default Question;