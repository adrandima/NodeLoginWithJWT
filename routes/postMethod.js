const router = require('express').Router();
//assign token verification
const verify = require('./verifyToken');


router.get('/',verify,(req,res)=>{
    res.send(req.user);


/*    res.json({
        posts:{
            title:'First Post',
            desc:'random data'
        }
    });*/

})

module.exports = router;
