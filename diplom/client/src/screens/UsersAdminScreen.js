import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {deleteUser, getAllUsers} from "../store/actions/userAction";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {faSquareCheck, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {changeRole} from "../store/actions/userAction";

const UserInfo = ({user}) => {
  const [role, setRole] = useState(user.role)

  const dispatch = useDispatch()

  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>
        <select value={role} onChange={(e) => {setRole(e.target.value)}}>
          <option value="ADMIN">ADMIN</option>
          <option value="EDITOR">EDITOR</option>
          <option value="USER">USER</option>
        </select>
      </td>
      <td>
        {role !== user.role &&
          <FontAwesomeIcon style={{cursor: "pointer", backgroundColor: 'white', color: 'blue'}}
                           onClick={async () => {
                             await dispatch(changeRole(user.id, role))
                             dispatch(getAllUsers())
                           }}
                           icon={faSquareCheck}/>
        }
        {<FontAwesomeIcon
          style={{cursor: "pointer", marginLeft: '10px', color: 'red'}}
          onClick={() => {
            if (window.confirm('Удалить пользователя?')) {
              dispatch(deleteUser(user.id))
              dispatch(getAllUsers())
            }
          }}
          icon={faXmark}
        />}
      </td>
    </tr>
  )
}


const UsersAdminScreen = () => {

  const dispatch = useDispatch()

  const userList = useSelector(state => state.userList)
  const {loading, error, users} = userList

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])



  return (
    <div>
      <h1>Пользователи</h1>
      {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
        <table>
          <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {users.map(user => <UserInfo user={user} key={user.id}/>)}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersAdminScreen;