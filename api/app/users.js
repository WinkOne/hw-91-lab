const path = require('path');
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const multer = require("multer");
const nanoid = require('nanoid');
const config = require("../config");
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, config.uploadPath),
    filename: (req, file, cb) => cb(null, nanoid() + path.extname(file.originalname))
});

const upload = multer({storage});

router.post('/', upload.single('avatar'), async (req, res) => {

    const users = req.body;

    if(req.file) {
        users.avatar = req.file.filename;
    }

    const user = new User({
        username: users.username,
        password: users.password
    });

    try {
       user.generateToken();

       await user.save();

       return res.send(user);

   } catch (error) {

       return res.status(400).send(error);

   }
});

router.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    if(!user) {
        return res.status(400).send({error: 'Username or password not correct!'});
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if(!isMatch){
        return res.status(400).send({error: 'Username or password not correct!'});
    }

    user.generateToken();

    await user.save();

    res.send(user);
});

router.get('/', auth, async (req, res) => {
    const user = req.user;

    return res.send(user);
});

router.delete('/sessions', async (req, res) => {
   const success = {message: 'Success'};

   try {
       const token = req.get('Authorization').split(' ')[1];

       if (!token) return res.send(success);

       const user = await User.findOne({token});

       if(!user) return res.send(success);

       user.generateToken();

       await user.save();

       return res.send(success);
   } catch (e) {
       return res.send(e)
   }
});

module.exports = router;