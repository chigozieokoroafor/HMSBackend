const { sequelize, students} =  require('../models');
const express = require("express");
const router = express.Router();

// authentication first
router.use(express.json())


router.get("/signin", async (req, res)=>{
    res.send("holla").status(200)
});


router.post("/user", async(req, res) => {
    const {firstName, matricNo, password} = req.body;
    // console.log({name, m_number, password});
    // console.log(Students)
    const req_params = ["firstName", 'matricNo', "password"];
    try {
        const user =  await students.create({firstName, matricNo, password});
        return res.json(user).status(200);

    }catch(err){
        // console.log(err);
        errName =  err.name
        switch (errName){
            case "SequelizeValidationError":
                err_data = {
                    message: err.errors[0].message
                };
                return res.status(400).json(err_data);        
        }
        return res.status(400).json(err);
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
