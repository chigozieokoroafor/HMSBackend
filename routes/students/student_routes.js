const { sequelize, students} =  require('../../models');
const express = require("express");
const router = express.Router();

// authentication first
router.use(express.json())


router.post("/signin", async (req, res)=>{
    const {matricNo, password} =  req.body;
    const check = await students.findOne({
        where:{
            matricNo:matricNo
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

router.post("/user", async(req, res) => {
    const {firstName, matricNo, password, dept, faculty, part} = req.body;
    // console.log({name, m_number, password});
    // console.log(Students)
    // const req_params = ["firstName", 'matricNo', "password"];
    try {
        const user =  await students.create({firstName, matricNo, password, dept, faculty, part});
        const res_data = {
            message:"",
            data:user,
            success:true
        }
        return res.json(res_data).status(200);

    }catch(err){
        // console.log(err);
        errName =  err.name
        switch (errName){
            case "SequelizeValidationError":
                err_data = {
                    message: err.errors[0].message,
                    data:{},
                    success:false
                };
                return res.status(400).json(err_data);        
                
            case "SequelizeUniqueConstraintError":
                err_data = {
                    message: "Matric number exists",
                    data:{},
                    success:false
                };
                return res.status(400).json(err_data);
        }
        // return res.status(400).json(err);
    };
});


router.get("/user", async(req, res)=>{
    try{
    const all_users = await students.findAll();
    
    return res.status(200).json(all_users);
} catch(err){
    console.log(err);
    return res.status(400).json(err);
};
});


router.get("/user/:uid", async(req, res)=>{
    const uid =  req.params.uid
    try{
        const user = await students.findOne({where:{uuid:uid}});
    
        return res.status(200).json(user);
} catch(err){
    console.log(err);
    return res.status(400).json(err);
};
});


module.exports =  router;
