const express = require('express');
const app =express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/postMethod');


const User = require('../CSSELogin/model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {loginValidation} = require('../CSSELogin/validation');


dotenv.config();

//add  connection
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser: true,useUnifiedTopology: true },
    ()=>console.log('Connected to db')
);

//middlewere



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//Route middleware

app.use('/api/user',authRoute);
app.use('/api/post',postRoute);






app.post('/login', async (req,res)=>{



    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check the user already exist or not
    const user = await User.findOne({email: req.body.email});
    if(!user) return  res.status(400).send('Email or password is wrong');

    //check password is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) res.status(400).send('Invalid Password');


    //Create and assign a token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);

    res.end(JSON.stringify(user));
    //res.header('auth-token',token).send(token);

});






app.listen(3000,()=>console.log('Server up and running'));








