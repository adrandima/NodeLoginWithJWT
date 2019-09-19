const express = require('express');
const app =express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/postMethod');


dotenv.config();

//add  connection
mongoose.connect(process.env.DB_CONNECT,
    {useNewUrlParser: true},
    ()=>console.log('Connected to db')
);

//middlewere
app.use(express.json());




//Route middleware

app.use('/api/user',authRoute);
app.use('/api/post',postRoute);


app.listen(3000,()=>console.log('Server up and running'));







