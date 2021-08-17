const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

const comments = {};

app.get('/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    res.send(comments[postId] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    console.log(comments, 'here');
    const id = randomBytes(4).toString('hex');
    const { comment } = req.body;
    const postId = req.params.id;
    
    const selectedComments = comments[postId] || [];

    selectedComments.push({id, comment, status: 'Pending'});
   

    comments[postId] = selectedComments;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id, comment, postId,
            status: 'Pending'
        }
    }).catch(e => console.log(e));

    res.status(201).send(selectedComments);
});

app.post('/events', async (req, res) => {
    console.log('Comment Service Received Event', req.body.type);
    const {type, data} = req.body;

    if(type === 'CommentModerated') {
        const {postId, id, status, comment} = data;
        
        const commentsArr = comments[postId];

        const selectedComment = commentsArr.find(comment => {
            return comment.id === id;
        });
        selectedComment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, status, postId, comment
            }
        }).catch(e => console.log(e));
    }
    res.send({});
});

app.listen(4001, () => {
    console.log('Listening on port 4001');
});
