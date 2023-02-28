import React, {useEffect, useState} from 'react';
import {Button, Col, Form, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {registerUser} from "../store/actions/userAction";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {Link, useNavigate} from "react-router-dom";

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userRegister = useSelector(state => state.userRegister)
  const {loading, userInfo, error} = userRegister

  useEffect(() => {
    if (userInfo) {
      navigate('/', {replace: true})
    }
  }, [navigate, userInfo])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают')
    }
    dispatch(registerUser(
      name, login, password
    ))
  }

  return (
    <div className='login-screen'>
      <div className='login-screen__header-box'>
        <h1 className='login-screen__header'>Вход</h1>
        {loading && <Loader className='login-screen__loader' size='35px'/>}
      </div>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      <Form className='auth-form' onSubmit={submitHandler}>
        <FormGroup>
          <FormLabel>Введите имя</FormLabel>
          <FormControl type='text'
                       placeholder='Введите имя'
                       value={name}
                       onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        <FormGroup className='pt-3'>
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
          <FormLabel>Подтвердите пароль</FormLabel>
          <FormControl type='password'
                       placeholder='Подтвердите пароль'
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup className='pt-3'>
          <Button type='submit' variant='primary'>
            Зарегистрироваться
          </Button>
        </FormGroup>
      </Form>

      <Row className='py-3'>
        <Col>
          Уже зарегистрированы?{' '}
          <Link to={'/login'}>
            Авторизоваться
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterScreen;