const express = require('express');
const cors = require('cors');
const nanoid = require('nanoid');

const config = require('./config');
const mongoose = require('mongoose');
const expressWs = require('express-ws');

const User = require('./model/User');
const Message = require('./model/Message');
const users = require('./app/users');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
expressWs(app);

const run = async () => {
    await mongoose.connect(config.database, config.databaseOptions);

    app.use('/users', users);

    const connections = {};

    app.ws('/chat', async function (ws, req) {
        const token = req.query.token;

        if (!token) {
            return ws.close();
        }
        const user = await User.findOne({token});

        if (!user) {
            return ws.close();
        }

        const id = nanoid();

        console.log(`Client connected id=' + ${id}`);

        connections[id] = {user, ws};
        const userName = Object.keys(connections).map(key => {
            return connections[key].user.username
        });

        console.log('Total clients connected: ' + Object.keys(connections).length);

        const messages = await Message.find().sort({datetime: 1}).limit(30);

        ws.send(JSON.stringify({
            type: 'LAST_MESSAGES',
            messages: messages
        }));

        Object.keys(connections).forEach(key => {
            connections[key].ws.send(JSON.stringify({type: 'NEW_USER', userName}))
        });

        ws.on('message', (msg) => {
            console.log(`Incoming message from ${id}: `, msg);
            let newMessage;
            try {
                newMessage = JSON.parse(msg);
            } catch (e) {
                return console.log('Not a valid message ');
            }
            if (newMessage.type === 'CREATE_MESSAGE') {

                const messageData = {
                    user: user.username,
                    message: newMessage.text
                };
                const message = new Message(messageData);
                message.save();

                Object.keys(connections).forEach(connId => {
                    const connection = connections[connId].ws;

                    connection.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        message
                    }));
                });
            }
        });

        ws.on('close', (msg) => {
            console.log(`Client disconnected! ${id}`);
            delete connections[id];
            const userName = Object.keys(connections).map(key => {
                return connections[key].user.username
            });
            Object.keys(connections).forEach(key => {
                connections[key].ws.send(JSON.stringify({type: 'DISCONNECTED_USER', userName}))
            });
        });
    });

    app.listen(config.port, () => {
        console.log(`Server started on ${config.port} port!`)
    })
};

run().catch(e => {
    console.error(e)
});