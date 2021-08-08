import React from 'react';

/*에러났을때*/
const ErrorSet = (props, router) => {
  let message;
  if (props.request !== undefined) {
    /*반환되는게 있을때*/
    if (props.request.status === 401) {
      /*로그인 안되어있을때*/
      alert('로그인해주세요.');
      localStorage.removeItem('hyparkToken');
      router.push('/login');
    }
  }

  return <></>;
};

export default ErrorSet;
