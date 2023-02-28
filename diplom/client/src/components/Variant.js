import React, {useState} from 'react';
import {Form} from "react-bootstrap";

const Variant = (props) => {
  const variant = props.variant
  const [checked, setChecked] = useState(false)

  return (
    <Form.Check
      key={variant.id}
      name={variant.questionId}
      type={props.type}
      id={variant.id}
      label={`${variant.title}`}
      onSelect={() => setChecked(!checked)}
    />
  );
};

export default Variant;