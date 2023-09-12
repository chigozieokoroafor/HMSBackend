const { sequelize, rooms, hostels, blocks} =  require('../../models');
const express = require("express");
const router = express.Router();
const uuid = require('uuid');
uuid.v4()

// authentication first
router.use(express.json())

router.get("/get", async(req, res)=>{
    var hostel = await hostels.findAll()
    res.send(hostel).status(200)

});
router.post('/uploadHostel', async(req, res) =>{
    const {name, gender} =  req.body;
    const res_data = {
        message:"",
        data:{},
        success:true
    };

    try{
        const hostel = await hostels.create({uuid:uuid.v4(),name, gender});
        res_data.data = hostel
    }
    catch(err){
        error = err.name;
        res_data.success = false
        switch(error){
            case "SequelizeUniqueConstraintError":
                res_data.message = err.errors[0].message
        }
        

        return res.json(res_data).status(200);
    }
    
    return res.json(res_data).status(200);
});

// make it so that everything would come from a specific csv file for initial upload.
// this is for the admin end.
router.post('/uploadBlocks', async(req, res) =>{
    const {hostel_id,label} =  req.body;
    const res_data = {
        message:"",
        data:{},
        success:true
    };

    try{
        const block = await blocks.create({uuid:uuid.v4(),label, hostel_id});
        res_data.data = block
        // console.log(res_data)
    }
    catch(err){
        error = err.name;
        res_data.success = false
        // console.log(err)
        switch(error){
            case "SequelizeUniqueConstraintError":
                res_data.message = err.errors[0].message
        }
        

        return res.json(res_data).status(200);
    }
    
    return res.json(res_data).status(200);
});

router.post("/uploadRooms", async(req, res)=>{
    const {} = request.body;
    
})


module.exports =  router;