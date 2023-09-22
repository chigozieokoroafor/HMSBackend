const express = require('express');
const {admin, sequelize, hostels, organizations, rooms} =  require("../../models");
const { ValidationError } = require('sequelize');
// const rooms = require('../../models/rooms');
// const organizations = require('../../models/organizations');
// const hostels = require('../../models/hostels');

routes =  express.Router();

routes.use(express.json())

routes.post('/uploadAdmin', async(req, res)=>{
    const {username, email, password,org, superAdmin, hostel} = req.body;
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
        return res.send(response).status(400);
    }


    try{
        const admin_check = await admin.findOne({
            where:{
                username, email, org_id
            }        
        });
        
        if (admin_check === null){    
            const new_admin = await admin.create(
                {username, email, password,org_id, superAdmin, hostel}
            )
            response.data = new_admin;
            response.success = true;
            return res.send(response).status(200);

        }else{
            response.data = {}
            response.message = "Admin with credentials exists"
            response.success =  false
            return res.send(response).status(400);
        }
    }catch(err){
        // return res.send(err).status(400)
        switch (err.name){
            case 'SequelizeValidationError':
                response.data =  err.errors[0].message;
                response.success = false;
                response.message =  '';
                return res.send(response).status(400)
        };
            
    }
});

routes.get('/fetchHostels', async(req, res)=>{
    // get authorization token and decode it and get the organization and superAdmin check the user falls under.
    offset = 5
    const {username, superAdmin, organization, hostel, page, hostel_id} = req.query;
    // hostel in line 62 is the hostel_id of the hostel itself
    if (page ===null) page=0;
    
    skip = offset * page

    const all_hostels = await rooms.findAll({
        where:{
            hostel_id:hostel_id
        },
        offset:skip,
        limit:offset
    })
    let response = {
        data: all_hostels,
        success:true,
        message:""
    }
    return res.send(response).status(200);
});

routes.get('/getAvailableRooms', async(req, res)=>{
    const {user_id, page, org_id} = req.query;
    if (page ===null) page=0;
    offset = 20
    skip = offset * page

    const availRooms = await rooms.findAll({
        where:{
            status: 1,
            matricNo:'',
            org_id:org_id
        },
        limit:offset,
        offset:skip
    })
    let response = {
        data:availRooms|| {},
        message:'',
        success:true
    }
    return res.send(response).status(200);

    
});

routes.get('/getAvailableHostels', async(req, res)=>{
    // get the organization and if user is a super admin.

    const data  = await rooms.findAll({
        attributes: ['hostel_id'],
        group: ['hostel_id'],
        where:{
            status:1
        }
      }).then(projects => 
        projects.map(project => project.hostel_id)
      );
    let host_data = []
    for(var i=0; i<data.length;i++){
        let hos_data = await hostels.findOne({
                            attributes:["name"],
                            where:{
                                hostel_id:data[i],
                                allocated:false
                            }
                        })
        let j_ = {
            id:data[i],
            name:hos_data["name"]
        }
        host_data.push(j_)
        // res.send(hos_data).status(200)
    }
    response = {
        data:{"hostels":host_data},
        message:"",
        success:true
    }
    return res.send(response).status(200);
});

routes.get('/getHostelBlocks', async(req, res)=>{
    // get the hostel in question

    const {hostel_id} = req.query;

    const data  = await rooms.findAll({
        attributes: ['block'],
        group: ['block'],
        where:{
            hostel_id:hostel_id,
            status:1,
            allocated:false
        }
      }).then(block => 
        block.map(block => block.block)
      );

    response = {
        data:{"blocks":data},
        message:"",
        success:true
    }
    return res.send(response).status(200);
});


routes.get('/getBlockRooms', async(req, res)=>{
    // get the hostel in question

    const {hostel_id, block} = req.query;

    const data  = await rooms.findAll({
        attributes: ['roomNo'],
        group:["roomNo"],
        where:{
            hostel_id:hostel_id,
            block:block,
            status:1,
            allocated:false
        }
      }).then(room => 
        room.map(room => room.roomNo)
      );


    response = {
        data:{"rooms":data},
        message:"",
        success:true
    }
    return res.send(response).status(200);
});

routes.get('/getRoomSpace', async(req, res)=>{
    // get the hostel in question

    const {hostel_id, block, roomNo} = req.query;

    const data  = await rooms.findAll({
        attributes: ['bedNo'],
        // group:["roomNo"],
        where:{
            hostel_id:hostel_id,
            block:block,
            roomNo:roomNo,
            status:1,
            allocated:false
        }
      }).then(room => 
        room.map(room => room.bedNo)
      );


    response = {
        data:{"bedspaces":data},
        message:"",
        success:true
    }
    return res.send(response).status(200);
});

routes.post('/allocate', async(req, res) => {
    const {matricNo, hostel_id, block, bedNo, roomNo} = req.body
    let freeRoom = await rooms.findOne({
        where:{
            hostel_id, block, bedNo, roomNo
        }
    })
    freeRoom.matricNo = matricNo;
    freeRoom.status = 2;
    freeRoom.allocated=true;

    await freeRoom.save();

    let response = {
        data: freeRoom,
        success:true,
        message: 'Succesfully allocated'
    }
    return res.send(response).status(200)


});

routes.post('/uploadHostel', async(req, res) =>{
    const {name, gender, org_id} =  req.body;
    const res_data = {
        message:"",
        data:{},
        success:true
    };

    try{
        const hostel = await hostels.create({name, gender, org_id});
        console.log(hostel);
        res_data.data = hostel
        return res.send(res_data).status(200)
    }
    catch(err){
        // return res.send(err).status(400)
        error = err.name;
        res_data.success = false
        res_data.data = {}
        res_data.message = "Error occured"
        switch(error){
            case "SequelizeUniqueConstraintError":
                res_data.message = err.errors[0].message;
                break
            
            case "SequelizeValidationError":
                res_data.message = err.errors[0].message;
                break
        }

        return res.json(res_data).status(200);
    }
    
    
});

// make it so that everything would come from a specific csv file for initial upload.
// this is for the admin end.
routes.post('/uploadBlocks', async(req, res) =>{
    const {hostel_id,label} =  req.body;
    const res_data = {
        message:"",
        data:{},
        success:true
    };

    try{
        const block = await blocks.create({label, hostel_id});
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


routes.post("/uploadRooms", async(req, res)=>{
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



// routes.post("/uploadOrganization", async(req, res) => {
//     const {name} = req.body;
//     organizations
// });
module.exports = routes;
