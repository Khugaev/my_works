import React from 'react';
import {Button, Form} from "react-bootstrap";
import Question from "./Question";
import {useDispatch, useSelector} from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import {checkTest, updateResult} from "../store/actions/testAction";
import {TEST_ALREADY_PASSED, TEST_NOT_EXIST} from "../utils/errorCodes";

const Test = () => {

  const dispatch = useDispatch()

  const {userInfo} = useSelector(state => state.userLogin)
  const {loading, test, error} = useSelector(state => state.test)

  const testResult = useSelector(state => state.testResult)
  const resultLoading = testResult.loading
  const result = testResult.result
  const errorResult = testResult.error

  const handleSubmit = async (event) => {
    event.preventDefault()

    const answer = {}
    for (let i = 0; i < event.target.length - 1; i++) {
      if (answer[event.target[i].name] === undefined) {
        answer[event.target[i].name] = {[event.target[i].id]: event.target[i].checked}
      } else {
        answer[event.target[i].name][event.target[i].id] = event.target[i].checked
      }
    }
    if (Object.keys(result).length !== 0) {
      if (window.confirm(`Перезаписать результат?`)) {
        await dispatch(updateResult(test.testId, answer))
      }
    } else {
      await dispatch(checkTest(test.testId, answer))
    }
  }

  const errorHandler = () => {
    if (error) {
      if (error.error === TEST_NOT_EXIST.error) {
        return <></>
      } else {
        return <Message variant='info'>{error.message}</Message>
      }
    } else if (errorResult) {
      if (errorResult.error === TEST_ALREADY_PASSED.error) {
        return <div>
          <h3>Тест:</h3>
          <Message variant='info'>{errorResult.message}</Message>
          {Object.keys(result).length ? <p>Ваш предыдущий результат: {result.totalScore}</p> : <p></p>}
          <Form onSubmit={handleSubmit}>
            {test.questions.map(data => <Question question={data} key={data.id}/>)}
            <Button type="submit">Проверить</Button>
          </Form>
        </div>
      } else {
        return <Message variant='info'>{errorResult.message}</Message>
      }
    } else {
      return <div>
        <h3>Тест:</h3>
        {Object.keys(result).length ? <p>Ваш предыдущий результат: {result.totalScore}</p> : <p></p>}
        <Form onSubmit={handleSubmit}>
          {test.questions.map(data => <Question question={data} key={data.id}/>)}
          <Button type="submit">Проверить</Button>
        </Form>
      </div>
    }
  }

  if (userInfo) {
    return (
      <div>
        {loading !== false || resultLoading !== false? <Loader/> : errorHandler()}
      </div>
    )
  } else {
    return (
      <h4>Авторизуйтесь, чтобы пройти тест</h4>
    )
  }
}

export default Test;