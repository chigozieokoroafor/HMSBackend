const { sequelize, students, rooms} =  require('../../models');
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
        let response = {
            message:"User with matric number not found",
            data:{}
        }
        
        return res.send(response).status(404);
    }
    else{
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
    const {fullName, matricNo, password, dept, faculty, part} = req.body;
    // console.log({name, m_number, password});
    // console.log(Students)
    // const req_params = ["firstName", 'matricNo', "password"];
    try {
        const user =  await students.create({fullName, matricNo, password, dept, faculty, part});
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

router.get("/requestBedspace", async(req, res)=>{
// the jwt token will contain user's matric number and gender
    matricNo = req.query.matricNo;
    let data = {}
    let student = await students.findOne({
        where:{
            matricNo:matricNo
        }
    })

    if (student.room_id===0){    
        const room = await  rooms.findOne({
            where: {
                "gender":"M",
                "matricNo":""
            },
            order:sequelize.random(),
            limit:1
        }) ;
        try{
            await room.update({
                matricNo:matricNo
            }
            )
            
            student.update({
                room_id:room.id
            })
            data.data =  room;
            data.message = "";
            data.success = true;
            return res.send(data).status(200);


        } catch(err){
            data.message = "Bedspace exhausted";
            data.success = false;
            data.data = {};
            return res.send(data).status(400);
        }
    }else{
        data.message = "User already occupied a space",
        data.data = {};
        data.success = false;

        return res.send(data).status(400);
    }

    
});

router.get("makePayment")
// this should take them to a payment link or page where they end up paying

// create a webhook to listen to payments.
// checkout remitta's webhook payment


module.exports =  router;
