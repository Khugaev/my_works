import React from 'react';
import Variant from "./Variant";

const Question = (props) => {

  const question = props.question
  return (
    <div>
      <h5>{question.title}</h5>
      <div>
        {question.variants.map((v, index) => <Variant type={question.type} variant={v} key={v.id}/>)}
      </div>
    </div>
  );
}

export default Question;
