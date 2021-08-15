import React from 'react';

const CommentList = ({ comments }) => {
  
  const commentsArr = (comments || []).map((c) => {
    let comment;

    if(c.status == 'Approved') {
      comment = c.comment;
    }

    if(c.status == 'Pending') {
      comment = 'This comment is waiting for moderation';
    }

    if(c.status == 'Rejected') {
      comment = 'This comment is rejected';
    }

    return <li key={c.id}>{comment}</li>;
  });

  return <ul>{commentsArr}</ul>;
};

export default CommentList;
