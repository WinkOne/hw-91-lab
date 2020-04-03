const mongoose = require('mongoose');
const config = require("./config");
const nanoid = require('nanoid');


const User = require('./model/User');

const run = async () => {
    await mongoose.connect(config.database, config.databaseOptions);

    const collection = await mongoose.connection.db.listCollections().toArray();

    for (let coll of collection) {
        await mongoose.connection.db.dropCollection(coll.name);
    }
    await User.create({
        username: 'User',
        password: '123',
        avatar: 'fixtures/кот.jpg',
        token: nanoid()
    }, {
        username: 'Admin',
        password: '123',
        avatar: 'fixtures/кот.jpg',
        role: 'admin',
        token: nanoid()

    });

    mongoose.connection.close();
};

run().catch(e => {
    throw e;
});
