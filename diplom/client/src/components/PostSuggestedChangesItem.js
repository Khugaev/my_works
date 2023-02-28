import React from 'react';
import {useDispatch} from "react-redux";
import {fetchPost, getChangeActionAdmin} from "../store/actions/postAction";
import {Link} from "react-router-dom";

const PostSuggestedChangesItem = ({suggestedChange}) => {
  const dispatch = useDispatch()
  console.log(suggestedChange)

  return (
    <table>
      <tbody>
        <tr>
          <th>Пост</th>
          <td>
            <Link to='/' onClick={() => dispatch(fetchPost(suggestedChange.p_id))}>
              {suggestedChange.postTitle}
            </Link>
          </td>
          <td rowSpan='3'> <Link to='/admin/post/suggested_changes' onClick={() => {
            dispatch(getChangeActionAdmin(suggestedChange.p_id, suggestedChange.u_id))
            dispatch(fetchPost(suggestedChange.p_id))
          }}>-></Link></td>
        </tr>
        <tr>
          <th>Кем предложено</th>
          <td>{suggestedChange.userName}</td>
        </tr>
        <tr>
          <th>Дата</th>
          <td>{suggestedChange.updatedAt}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PostSuggestedChangesItem;