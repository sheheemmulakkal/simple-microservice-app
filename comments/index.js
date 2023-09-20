const express = require( 'express' )
const { randomBytes } = require( 'crypto' ) 
const cors = require('cors')
const axios = require( 'axios' ) 


const app = express()

app.use( express.json() )
app.use( cors() )

const commentsByPosts = {}


app.get( '/posts/:id/comments', ( req, res ) => {
    res.json(commentsByPosts[req.params.id] || [])
})

app.post( '/posts/:id/comments', async( req, res ) => {
    try {

        const commentId = randomBytes(4).toString('hex')
        const { content } = req.body
        
        const comments = commentsByPosts[req.params.id] || []
        comments.push({ id : commentId, content, status : 'pending' })
        commentsByPosts[req.params.id] = comments
        
        await axios.post( 'http://event-bus-srv:4005/events',{
            type : 'CommentCreated',
            data : {
                id : commentId,
                content,
                postId : req.params.id,
                status : 'pending'
            }
        })
        res.json(comments)
    } catch( error ) {
        console.log(error.message);
    }
})

app.post( '/events', async ( req, res ) => {
    const { type, data } = req.body
    if ( type === 'CommentModerated' ) {
        const { id, postId, content, status } = data

        const  comments = commentsByPosts[postId]
        const comment = comments.find( comment => {
            return comment.id === id
        })
        comment.status = status

        await axios.post('http://event-bus-srv:4005/events', {
            type : 'CommentUpdated', 
            data : {
                id, 
                postId,
                content,
                status
            }
        })
    }
    res.send({})
})

app.listen(4001, () => {
    console.log( 'listening on the port 4001')
}) 