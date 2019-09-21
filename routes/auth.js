const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation,loginValidation} = require('../validation');


router.post('/register',async (req,res)=>{
    //validate user

    console.log("Test user registration");
//validate user input
    const  {error} = registerValidation(req.body);
    if(error) return  res.status(400).send(error.details[0].message);

//Check the user already exist or not
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return  res.status(400).send('Email already exist');

//Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);



    //creating new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password :hashPassword
    });

    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch (err) {
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req,res)=>{
    
    console.log(req.body);
    console.log(req.body.password);

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




module.exports = router;

















