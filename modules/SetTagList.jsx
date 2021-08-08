import React from 'react';
import {Chip} from '@material-ui/core';

const SetTagList = (data) => {
  let dom = <></>;
  let list = data.data;
  if (list.length > 0) {
    dom = list.map((value) => {
      return <Chip label={value} style={{marginRight: '10px'}} key={value} />;
    });
  }
  return dom;
};

export default SetTagList;
