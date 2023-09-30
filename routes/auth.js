// this file would contain authentication routes for both students and admin users
const { sequelize, students, admin, rooms, organizations} =  require('../models');
const express = require("express");
const {secret_key, validate_token} = require('./functions');
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const { valid } = require('joi');
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
    try{
        const check = await students.findOne({
            where:{
                matricNo:username
            }
        })
        let token;

        if (check===null){
            // use associations here to get the organization the admin falls under
            let admin_check =  await admin.findOne({
                where:{
                    username:username
                }
            })

            if (admin_check !== null){
                if (password === admin_check.password){
                    
                    const {id, superAdmin, org_id, hostel} =  admin_check;
                    token = jwt.sign(
                        {id, superAdmin, org_id, hostel},
                        secret_key,
                        {expiresIn:'1h'}
                    )
                    
                    
                    response.message = "";
                    response.success = true;
                    response.token = token;
                    
                    return res.send(response).status(200);
                }
                else{
                    response.message = "Incorrect Credentials provided"
                    response.data = {}
                    response.success =  false
                    response.token = ""
                    return res.send(response).status(404);
                }
            }else{    
                    
                response.message = "Incorrect Credentials provided"
                response.data = {}
                response.success =  false
                response.token = ''
                return res.send(response).status(404);
            }
        }
        else{
            if (password === check.password){
                // console.log(check);
                let id = check.matricNo
                token = jwt.sign(
                    {id:id,
                    gender:check.sex,
                    programType: check.programType
                },
                    secret_key,
                    {expiresIn:'1h'}
                )
                // response.data = {matricNo, fullName, dept, faculty, room_id };
                response.message = "";
                response.success = true;
                response.token = token;
                
                return res.send(response).status(200);
            }
            else{
                response.message = "Incorrect Credentials provided"
                
                return res.send(response).status(404);
            }
            
        }
    }catch(error){
        return res.send(error).status(400)
    }
});

// add a secret key to this.
router.post('/uploadAdmin', validate_token ,async(req, res)=>{
    
    const user =  req.user;
    const super_admin = user.superAdmin;
    const admin_org_id = user.org_id;
    const admin_id = user.id;

    
    
    if (admin_org_id===1 && super_admin === true)
    {    
        const {username, email, password,org, superAdmin, hostel, s_key} = req.body;
        
        let response = {
            data:{},
            success:true,
            message:''
        }

        let org_check =  await organizations.findOne({
                                where:{
                                    name:org
                                }
                            })
        let org_id = 1
        let token = ""
        if (org_check === null){
            const new_org = await organizations.create({
                "name":org
            })
            console.log(new_org)
            org_id = new_org.org_id
        }else{
            org_id = org_check.org_id
        }

        if(superAdmin===false && hostel===null){
            response.success = false;
            response.message = "Kindly provide hostel name admin is being created for";
            response.data= {}
            response.token = token
            return res.send(response).status(400);
        }


        try{
            const admin_check = await admin.findOne({
                where:{
                    username
                }        
            });
            
            if (admin_check === null){    
                const new_admin = await admin.create(
                    {
                        username, 
                        email, 
                        password,
                        org_id, 
                        superAdmin, 
                        hostel,
                        id:uuid.v4()
                    }
                )
                response.data = new_admin;
                response.success = true;
                response.token = token;
                return res.send(response).status(200);

            }else{
                response.data = {}
                response.message = "Admin with username provided exists"
                response.success =  false
                response.token = token
                return res.send(response).status(400);
            }
        }catch(err){
            // return res.send(err).status(400)
            switch (err.name){
                case 'SequelizeValidationError':
                    response.data =  err.errors[0].message;
                    response.success = false;
                    response.message =  '';
                    response.token = token
                    return res.send(response).status(400)
            };
                
        }
    } else{
        return res.send({
            message:"Cannot upload admin credentials, Kindly contact OAU",
            data:{},
            success:false,
            token:""
        })
    }
});

// router.get('/valTok', validate_token, async(req, res)=>{
//     return res.send(req.user)
// });
module.exports = router;

