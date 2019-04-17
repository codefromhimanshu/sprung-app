import Comment from './Comment';
import React from 'react';
import isEmpty from "lodash.isempty";

const CommentList = props => {
  if(props.comments ){
    return null;
  }
  
  return (
    <div>
      {
        props.comments.map(comment => {
          return (
            <Comment
              comment={comment}
              currentUser={props.currentUser}
              slug={props.slug}
              key={comment.id} />
          );
        })
      }
    </div>
  );
};

export default CommentList;
