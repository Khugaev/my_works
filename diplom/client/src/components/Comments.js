import React from 'react';
import UsersComments from "./UsersComments";
import CommentForm from "./CommentForm";

const Comments = () => {
  return (
    <div>
      <CommentForm/>
      <UsersComments/>
    </div>
  );
};

export default Comments;