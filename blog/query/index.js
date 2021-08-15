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

const handleEvent = (type, data) => {
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
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    handleEvent(type, data);
    
    res.send({});
});

app.listen(4002, async () => {
    console.log('Query Service Listening on port 4002');

    const res = await axios.get('http://localhost:4005/events').catch(e => console.log(e));
    for(let event of res.data) {
        console.log('Processing event...', event.type);
        handleEvent(event.type, event.data);
    }
});