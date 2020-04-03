const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    datetime: {
        type: Date,
        default: Date.now
    }
});
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;