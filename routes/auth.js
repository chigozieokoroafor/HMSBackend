// this file would contain authentication routes for both students and admin users
const { sequelize, students, admin, rooms} =  require('../models');
const express = require("express");
const router = express.Router();

// authentication first
router.use(express.json())
// the jwt token will contain user's matric number and gender

router.post("/signin", async (req, res)=>{
    const {username, password} =  req.body;
    let response = {
        message:"User with credentials not found",
        data:{},
        success:true
    }

    const check = await students.findOne({
        where:{
            matricNo:username
        }
    })
    if (check===null){
        // use associations here to get the organization the admin falls under
        let admin_check =  await admin.findOne({
            where:{
                username:username
            }
        })

        if (admin_check !== null){
            if (password === admin_check.password){
                // admin_check.remove('password');
                const {username, superAdmin, organization, hostel } =  admin_check;
                
                response.data = {username, superAdmin, organization, hostel };
                response.message = "";
                response.success = true;
                return res.send(response).status(200);
            }
            else{
                response.message = "Incorrect Credentials provided"
                response.data = {}
                response.success =  false
                return res.send(response).status(404);
            }
        }else{    
                
            response.message = "Incorrect Credentials provided"
            response.data = {}
            response.success =  false
            return res.send(response).status(404);
        }
    }
    else{
        if (password === check.password){
            console.log(check);
            const {matricNo, fullName, dept, faculty, room_id } =  check;
            response.data = {matricNo, fullName, dept, faculty, room_id };
            response.message = "";
            response.success = true;
            return res.send(response).status(200);
        }
        else{
            response.message = "Incorrect Credentials provided"
            
            return res.send(response).status(404);
        }
        
    }
});

router.post('/createAdminUser', async(req, res)=>{

});

module.exports = router;

