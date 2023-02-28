import React, {useEffect} from 'react';
import Results from "../components/Results";
import {Col, Row} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {getChangesAction} from "../store/actions/postAction";
import PostSuggestedChangesItem from "../components/PostSuggestedChangesItem";
import Loader from "../components/Loader";

const Profile = () => {

  const suggestedChanges = useSelector(state => state.postChanges.changes)
  const loading = useSelector(state => state.postChanges.loading)
  const {role} = useSelector(state => state.userLogin.userInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getChangesAction())
  }, [dispatch])



  return (
    <div>
      <h2>Личный кабинет</h2>
      <Row>
        {role === 'ADMIN' ? (<>
          <Col md='6'>
            <h4>Ваши результаты:</h4>
            <Results/>
          </Col>
          <Col md='6'>
            <h4>Предложенные изменения:</h4>

            {loading !== false ? <Loader/> : suggestedChanges.map(i => <PostSuggestedChangesItem suggestedChange={i} key={i.psc_id}/>)}
          </Col>
        </>) : (<>
          <Col md='12'>
            <h4>Ваши результаты:</h4>
            <Results/>
          </Col>
        </>)}

      </Row>
    </div>
  );
};

export default Profile;