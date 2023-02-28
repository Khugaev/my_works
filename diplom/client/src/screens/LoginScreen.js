import React, {useEffect, useState} from 'react';
import {Button, Col, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, registerUser} from "../store/actions/userAction";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {Link, useNavigate} from "react-router-dom";

const LoginScreen = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userLogin = useSelector(state => state.userLogin)
  const {loading, userInfo, error} = userLogin

  useEffect(() => {
    if (userInfo) {
      navigate('/', {replace: true})
    }
  }, [navigate, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(loginUser(
      login, password
    ))
  }

  return (
    <div className='login-screen'>
      <div className='login-screen__header-box'>
        <h1 className='login-screen__header'>Вход</h1>
        {loading && <Loader className='login-screen__loader' size='35px'/>}
      </div>
      {error && <Message variant='danger'>{error}</Message>}
      <Form className='auth-form' onSubmit={submitHandler}>
        <FormGroup>
          <FormLabel>Введите email</FormLabel>
          <FormControl type='email'
                       placeholder='Введите email'
                       value={login}
                       onChange={(e) => setLogin(e.target.value)}
          />
        </FormGroup>
        <FormGroup className='pt-3'>
          <FormLabel>Введите пароль</FormLabel>
          <FormControl type='password'
                       placeholder='Введите пароль'
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup className='pt-3'>
          <Button type='submit' variant='primary'>
            Войти
          </Button>
        </FormGroup>
      </Form>

      <Row className='py-3'>
        <Col>
          Еще не зарегистированы?{' '}
          <Link to={'/register'}>
            Зарегистрироваться
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default LoginScreen;