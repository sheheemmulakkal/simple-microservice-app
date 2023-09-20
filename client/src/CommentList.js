import React from 'react';


const CommentList = ({ comments }) => {

   
    const renderedComments = comments.map( comment => {

        let content;

        if ( comment.status === 'success' ) {
            content = comment.content
        } 
        if( comment.status === 'pending' ) {
            content =  'This comment is awaiting moderation'
        }
        if( comment.status === 'rejected' ) {
            content = 'This comment has been rejected'
        }
        return <li key={comment.id}>{content} <small><i>{comment.status}</i></small> </li>
    })

    return <div>
        <ul>{renderedComments}</ul>
    </div>
}

export default CommentList
