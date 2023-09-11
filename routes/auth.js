// this file would contain authentication routes for both students and admin users
const { sequelize, students} =  require('../../models');
const express = require("express");
const router = express.Router();

// authentication first
router.use(express.json())


router.post("/signin", async (req, res)=>{
    const {username, password} =  req.body;

    const check = await students.findOne({
        where:{
            matricNo:username
        },
        include:"room"
    })
    if (check===null){
        response = {
            message:"User with matric number not found",
            data:{}
        }
        
        return res.send(response).status(404);
    }
    else{
        // console.log (check);
        // console.log(check.password)
        if(password === check.password){
            return res.send(check).status(200);
        } else{
            response = {
                message:"incorrect password",
                data:{}
            }
            
            return res.send(response).status(404);
        }
        
    }
});


module.exports = router
