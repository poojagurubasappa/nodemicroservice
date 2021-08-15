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

const posts = {};

app.get('/posts', (req, res) => {
    console.log(posts, 'posts');
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if(type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    if(type === 'CommentCreated') {
        const {comment, postId, status} = data;
            id = data.id;

            const post = posts[postId];
            if(!post.comments) post.comments=[];
            post.comments.push({id, comment, status});
    }

    if(type === 'CommentUpdated') {
        const {id, comment, postId, status} = data;

        const post = posts[postId] || {};
        if(!post.comments) post.comments=[];
        const selectedComment = post.comments.find(comment => {
            return comment.id === id;
        });
        selectedComment.status = status;
        selectedComment.comment = comment;
    }
    res.send({});
});

app.listen(4002, () => {
    console.log('Query Service Listening on port 4002');
});