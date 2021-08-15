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

app.post('/events', async(req, res) => {
    console.log('Moderation Service Received an event');
    const {type, data} = req.body;

    if(type === 'CommentCreated') {
        const status = data.comment.includes('orange') ? 'Rejected' : 'Approved';

        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                comment: data.comment
            }
        }).catch(e => console.log(e));
    }
    res.send({});
});

app.listen(4003, () => {
    console.log('Moderation Service Listening on Port 4003');
});