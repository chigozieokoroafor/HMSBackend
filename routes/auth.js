// this file would contain authentication routes for both students and admin users
const { sequelize, students, admin} =  require('../models');
const express = require("express");
const router = express.Router();

// authentication first
router.use(express.json())
// the jwt token will contain user's matric number and gender

router.post("/signin", async (req, res)=>{
    const {username, password} =  req.body;

    const check = await students.findOne({
        where:{
            matricNo:username
        },
        include:"room"
    })
    if (check===null){

        let response = {
            message:"User with credentials not found",
            data:{}
        }
        
        return res.send(response).status(404);
    }
    else{
        if (password === check.password){
            return res.send(check).status(200);
        }
        else{
            let response = {
                message:"Incorrect password",
                data:{}
            }
            
            return res.send(response).status(404);
        }
        
    }
});

router.post('/createAdminUser', async(req, res)=>{

});

module.exports = router;
