export const validateEmail = (value) => {
  let bool = false;
  let result = '';
  if (value !== '') {
    bool = /^[\w+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(value);
    !bool ? (result = '이메일이 맞는지 확인해주세요.') : '';
  }
  return result;
};

export const validatePassword = (value) => {
  let bool = false;
  let result = '';
  if (value !== '') {
    bool = /^[a-zA-Z0-9\_\`\~\․\!\@\\\#\$\%\^\&\*\(\)\-\+\=\[\]\[\]\|\;\:\'\"\<\>\,\.\?\/\{\}\"\']{8,15}$/.test(value) && /^(?=.*\d)(?=.*[a-zA-Z]).{8,15}$/.test(value);
    !bool ? (result = '8~15자의 영문과 숫자를 포함해주세요.') : '';
  }
  return result;
};