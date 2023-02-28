import React from 'react';
import { Spinner } from 'react-bootstrap'

const Loader = ({className, size}) => {
  return (
    /*<Spinner className={className} animation='border'
             role='status'
             style={{
               width: `${size ? size : '100px'}`,
               height: `${size ? size : '100px'}`,
               margin: 'auto',
               display: 'block'
             }}
    >
    </Spinner>*/
    <div></div>
  );
};

export default Loader;