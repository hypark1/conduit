const SetDate = (value) => {
  let result = '';
  if (value) {
    result = value.slice(0, 10) + ' ' + value.slice(11, 19);
  }
  return result;
};

export default SetDate;
