const { sequelize, rooms, hostels, blocks} =  require('../../models');
const express = require("express");
const router = express.Router();
const uuid = require('uuid');
const {validateRooms, validateHostels} = require("./functions");


// authentication first
router.use(express.json())

router.get("/get", async(req, res)=>{
    let hostel = await hostels.findAll();
    res.send(hostel).status(200);

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
    const {roomNo, hostel_id, block_id, bedNo} = req.body;
    let data = {
        message : "",
        data: {},
        success:false
    }

    let {error} = validateRooms({roomNo, hostel_id, block_id, bedNo});
    
    if(error){
        
        data.message = error.details[0].message;
        return res.send(data).status(200);
    }
    
    // run a check here if data here exists
    try{
        const roomCheck = await rooms.findOne({
            where:{roomNo, hostel_id, block_id, bedNo}
        });
        
        if(roomCheck === null){    
            try{
                const hostel = await hostels.findOne({
                    where:{uuid:hostel_id}
                })
                
                gender = hostel.gender;

                const room = await rooms.create({roomNo, hostel_id, block_id, bedNo, gender:gender});
                data.data = room;
                data.success = true;
                data.message = "room uploaded";
                return res.send(data).status(200);

            }catch(err){
                data.data = {};
                data.message = err.errors[0].message;
                data.success = false;
                return res.send(data).status(400);
                }
            
        }else{ 
            data.data = {roomNo, hostel_id, block_id, bedNo} ;
            data.message = "data exists";
            return res.send(data).status(400);
        }

    }catch(err){
        data.data = {};
        data.message = err.errors[0].message;
        data.success = false;
        return res.send(data).status(400);
    }

})


module.exports =  router;