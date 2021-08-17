const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

const events = []; //simulating event data store


app.post('/events', (req, res) => {
    console.log('Event-Bus Received an event');
    const event = req.body;

    events.push(event);

    axios.post('http://posts-srv:4000/events', event).catch(e => console.log(e));
    axios.post('http://comments-srv:4001/events', event).catch(e => console.log(e));
    axios.post('http://query-srv:4002/events', event).catch(e => console.log(e));
    axios.post('http://moderation-srv:4003/events', event).catch(e => console.log(e));

    res.send({status: 200});
});

app.get('/events', (req, res) => {
res.send(events || []);
});

app.listen(4005, () => {
    console.log('Listening on port 4005');
});