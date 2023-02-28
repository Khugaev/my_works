import React, {useState} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import Question from "./Question";
import s from './Test.module.css'
import {addQuestion, createTest, deleteQuestion, getTest, updateTest} from "../../store/actions/testAction";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../Loader";

const Test = () => {
    const {post} = useSelector(state => state.post)
    const {loading, test} = useSelector(state => state.test)

    const dispatch = useDispatch()

    const addQuestionHandle = (type) => {
        dispatch(addQuestion({
            title: '',
            type: type,
            score: 0,
            variants: []
        }))
    }

    const handleSave = async (event) => {
        event.preventDefault()
        const data = test.questions

        try {
            if (window.confirm('Создать тест?')) {
                await dispatch(createTest(post.id, data ))
                alert('Тест создан')
                dispatch(getTest(post.id))
            } else {
                if (window.confirm('Обновить тест?')) {
                    await dispatch(updateTest(post.id, data))
                    dispatch(getTest(post.id))
                }
            }
        } catch (e) {
            if (e.response.request.status === 404) {
                if (window.confirm(`${e.response.data.message}\nОбновить тест?`)) {
                    await dispatch(updateTest(post.id, data))
                    dispatch(getTest(post.id))
                }
            }
        }
    }

    return (
        <Container className={s.test}>
            <h3 className={s.title}>Редактор тестов:</h3>
            {
                loading ? <Loader/> : (
                  <Form onSubmit={handleSave}>

                {test && test.questions.map((data, index) => <Question questionId={index} question={data} key={index}/>)}

                      <div className={s.buttons}>
                          <div className={s.addQuestion}>
                              <p>Добавить вопрос c типом</p>
                              <div className={s.addQuestionButtons}>
                                  <Button variant="outline-secondary" onClick={() => addQuestionHandle( 'checkbox')}>Checkbox</Button>
                                  <Button variant="outline-secondary" onClick={() => addQuestionHandle('radio')}>Radio</Button>
                              </div>
                          </div>
                      </div>
                      <div className={s.btnWrapper}>
                          <Button type="submit" className={s.saveButton} variant="success">Сохранить тест</Button>
                      </div>
                  </Form>
                )
            }

        </Container>
    );
}

export default Test;
