import React from 'react';

const CommentList = ({ comments }) => {
  
  const commentsArr = (comments || []).map((comment) => {
    return <li key={comment.id}>{comment.comment}</li>;
  });

  return <ul>{commentsArr}</ul>;
};

export default CommentList;
