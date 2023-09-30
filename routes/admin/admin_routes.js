const express = require('express');
const {admin, sequelize, hostels, organizations, rooms, students, hostel_status} =  require("../../models");
const { ValidationError, Op} = require('sequelize');
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const { validate_token } = require('../functions');

let token
let programs = {
    "1": "BSc",
    "2": "Masters/MPhil",
    "3": "PHD"
}

const routes =  express.Router();

routes.use(express.json())

//  this part is used to add admins to the platform for specific organizations


// this route is used in hostel record
// it returns in batches

routes.get('/getHostelRecord', validate_token, async(req, res)=>{
    const admin_user = req.user
    try{
        const {superAdmin, org_id, hostel, id} = admin_user;
        const admin_check = await admin.findOne({
            where:{
                id:id
            } 
        })
        

        let offset = 20
        let {page} = req.query;

        
        if (page === undefined){
            page=0}else{
                page = page-1
            };
        
        let skip = offset * page
        let all_hostels
        const attributes = ['hostel_name', 'block', "roomNo", "bedNo", "allocated", "status"]
        if (superAdmin===true && admin_check !== null){
            all_hostels = await rooms.findAll({
                attributes: attributes,
            where:{
                org_id:org_id
                
            },
            
            limit:offset,
            offset:skip
            })

            let response = {
                data: all_hostels,
                success:true,
                message:""
            }
            return res.send(response).status(200);


        }else if (superAdmin !==true && admin_check !== null){
            all_hostels = await rooms.findAll({
                attributes:attributes,
                where:{
                    hostel_name:hostel
                },
                
                limit:offset,
                offset:skip
            })
            let response = {
                data: all_hostels,
                success:true,
                message:""
            }
            return res.send(response).status(200);
        }else{
            return res.send({
                "message":"Unauthorized Access", 
                "data":{},
                "success":false,
                "token":""
            }).status(401)
        }
    } catch(error){
        
    }
    
});

// this  route is used to get the status of rooms.
routes.get('/getStatuses', validate_token, async(req, res)=>{
    const admin_user = req.user
    try{
        const {superAdmin, org_id, hostel, id} = admin_user;
        const admin_check = await admin.findOne({
            where:{
                id:id
            } 
        })
        if (admin_check !== null){
            const statuses = await hostel_status.findAll({});
            let response = {
                data:{statuses},
                success:true,
                message:'',
                token:''
            }
            return res.send(response).status(200);
        }else{
            return res.send({
                data:{},
                success:false,
                message:'',
                token:""
            })
        }
    }catch(error){}
})

// this route is used to create new statuses for hostels if need be.
routes.post('/createHostelStatus', async(req, res)=>{
    // add authorization to this

    const {status} = req.body;
    await hostel_status.create({
        status:status
    })
    response = {
        data:{},
        success:true,
        message:"Status created succesfully",
        token:""
    }
    return res.send(response).status(200)
})


// this route is used to update the status of rooms
routes.put('/updateRoomStatus', validate_token, async (req, res)=>{
    const {tag, id_list, status} =  req.body;

    const stat =  await hostel_status.findOne({
               status: status
    })
    console.log(stat)

    switch (tag){
        case "block":
            for(let i=0; i<id_list.length; i++)
            {
                await rooms.update({
                    status:stat.stat_id
                },
                {
                    block:id_list[i]
                })
                
            }
            return res.send({
                message:"Blocks  updated successfully",
                data:{},
                success:true
            }).status(200)
        case "room":
            for(let i=0; i<id_list.length; i++)
            {
                await rooms.update({
                    status:stat.stat_id
                },
                {
                    room_id:id_list[i]
                })
                
            }
            return res.send({
                message:"Rooms updated successfully",
                data:{},
                success:true
            }).status(200)
        
        

    }
})


routes.get('/studentRecord', validate_token ,async(req, res)=>{
    try{
        const {superAdmin, org_id, hostel, id} = req.user;
        const admin_check = await admin.findOne({
            where:{
                id:id
            } 
        })
        if (admin_check !== null){
            let params = ["block", "room"]

            let new_query = {};
            for (let i=0; i< params.length; i++){
                if(req.query[params[i]]!==undefined){
                    new_query[params[i]] = req.query[params[i]]
                }
            }
            new_query.matricNo = {[Op.not]: null};
            new_query.org_id = org_id;
            if (hostel!==undefined && superAdmin === false){
                new_query.hostel = hostel
            }
            // else if()

            const {page} = req.query;
            let offset = 20
            let skip = (page-1)*offset
            
            const records = await rooms.findAll({
                attributes:["matricNo",'hostel_name', 'block', "roomNo", "bedNo", "allocated", "users_paid"],
                where:new_query,
                offset:skip,
                limit:offset
            })
            if (records.length !==0){
                for(let j=0; j<records.length;j++){
                    records[j].dataValues["bedspace"] = records[j].hostel_name + ", "+ records[j].block + ", " + records[j].roomNo + ", "+ records[j].bedNo
                    
                }
            }
            const response = {
                data:records,
                message:"",
                token:"",
                success:true
            }

            return res.send(response).status(200);
        }else{
            return res.send(
                {
                    data:[],
                    message:"Unauthorized Access",
                    success:false
                }
            )
        }
    }catch(error){
        console.log(error.name)
    }

})

// this route is used to get information of specific students
routes.get('/fetchStudentInfo', validate_token, async(req, res)=>{
    try{    
        const {superAdmin, org_id, hostel, id} = req.user;
        const admin_check = await admin.findOne({
            where:{
                id:id,
            } 
        })
        if (admin_check !== null){    
            const {matricNo} = req.query;
            const room = await rooms.findOne({
                attributes:["hostel_name", "block", "roomNo"],
                where: {
                    matricNo,
                    org_id
                }
            })
            if(room !== null){   
                let student = await students.findOne({
                    attributes: ["fullName",'dept', "matricNo"],
                    where:{
                        matricNo:matricNo,
                    }
                })
                // console.log(student);
                student.dataValues.roomData = room
                
                response = {
                    data: student,
                    message:"",
                    success:true
                }
                return res.send(response).status(200)
            }else{
                return res.send({
                    data:{},
                    message: `Student with matricNo ${matricNo} not found`,
                    success:false,
                    token:''
                }).status(400)
            }

        }else{
                return res.send({
                    data:{},
                    message:"Unauthorized Access",
                    success:false,
                    token:''
                }).status(400)
            }

    }catch(error){

    }
    
})

// this section is used to get the list of available rooms in hostel.
routes.get('/getAvailableRooms', validate_token, async(req, res)=>{
    try{    
        const {superAdmin, org_id, hostel, id} = req.user;
        const admin_check = await admin.findOne({
            where:{
                id:id,
            } 
        })
        if (admin_check !== null){

            const {page} = req.query;
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
        }
    } catch(error){}
    
});

//  this section is used to get available hostels for custom allocations
routes.get('/getAvailableHostels', validate_token,async(req, res)=>{
    // get the organization and if user is a super admin.
    const user = req.user;
    try{
        const {superAdmin, org_id, hostel, id} = user;

        const data  = await rooms.findAll({
            attributes: ['hostel_name'],
            group: ['hostel_name'],
            where:{
                status:1,
                org_id:org_id
            }
        }).then(projects => 
            projects.map(project => project.hostel_name)
        );
        
        response = {
            data:{"hostels":data},
            message:"",
            success:true
        }
        return res.send(response).status(200);
    }catch(error){

    }
});


routes.get('/getHostelBlocks', async(req, res)=>{
    // get the hostel in question

    const {hostel_name} = req.query;

    const data  = await rooms.findAll({
        attributes: ['block'],
        group: ['block'],
        where:{
            hostel_name:hostel_name,
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

    const {hostel_name, block} = req.query;

    const data  = await rooms.findAll({
        attributes: ['roomNo'],
        group:["roomNo"],
        where:{
            hostel_name:hostel_name,
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

    const {hostel_name, block, roomNo} = req.query;

    const data  = await rooms.findAll({
        attributes: ['bedNo'],
        // group:["roomNo"],
        where:{
            hostel_name:hostel_name,
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

 
// this section is used to allocat user to specific room for custom allocation.
routes.post('/allocate', validate_token, async(req, res) => {
    const admin_user = req.user;
    try{
        const {superAdmin, org_id, hostel, id} = admin_user;

        let admin_check = await admin.findOne({
            where: {
                id:id,
                superAdmin:true
            }
        })
        // console.log(admin_check);
        if (admin_check !== null){
            const {matricNo, hostel_name, block, bedNo, roomNo} = req.body
            const st_check = await rooms.findOne({
                where:{
                    matricNo:matricNo
                }
            })
            
            if (st_check===null){    
                let freeRoom = await rooms.findOne({
                    where:{
                        hostel_name, block, bedNo, roomNo
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
            }else{
                response = {
                    data:{},
                    success:false,
                    message:"Student currently has a bedspace.",
                    token:""
                }
                return res.send(response).status(400)
            }
        }else {
            return res.send({
                "message":"Only Super admins can allocate hostels",
                "data":{},
                "success":false,
                "token":""
            }).status(400)
        }
    }catch(error){

    }
});



// routes.delete()

// this section is redundant, not using it any more.

// routes.post('/uploadHostel', async(req, res) =>{
//     const {name, gender, org_id} =  req.body;
//     const res_data = {
//         message:"",
//         data:{},
//         success:true
//     };

//     try{
//         const hostel = await hostels.create({name, gender, org_id});
//         console.log(hostel);
//         res_data.data = hostel
//         return res.send(res_data).status(200)
//     }
//     catch(err){
//         // return res.send(err).status(400)
//         error = err.name;
//         res_data.success = false
//         res_data.data = {}
//         res_data.message = "Error occured"
//         switch(error){
//             case "SequelizeUniqueConstraintError":
//                 res_data.message = err.errors[0].message;
//                 break
            
//             case "SequelizeValidationError":
//                 res_data.message = err.errors[0].message;
//                 break
//         }

//         return res.json(res_data).status(200);
//     }
    
    
// });

// // make it so that everything would come from a specific csv file for initial upload.
// // this is for the admin end.
// routes.post('/uploadBlocks', async(req, res) =>{
//     const {hostel_id,label} =  req.body;
//     const res_data = {
//         message:"",
//         data:{},
//         success:true
//     };

//     try{
//         const block = await blocks.create({label, hostel_id});
//         res_data.data = block
//         // console.log(res_data)
//     }
//     catch(err){
//         error = err.name;
//         res_data.success = false
//         // console.log(err)
//         switch(error){
//             case "SequelizeUniqueConstraintError":
//                 res_data.message = err.errors[0].message
//         }
        

//         return res.json(res_data).status(200);
//     }
    
//     return res.json(res_data).status(200);
// });


// routes.post("/uploadRooms", async(req, res)=>{
//     const {roomNo, hostel_id, block_id, bedNo} = req.body;
//     let data = {
//         message : "",
//         data: {},
//         success:false
//     }

//     let {error} = validateRooms({roomNo, hostel_id, block_id, bedNo});
    
//     if(error){
        
//         data.message = error.details[0].message;
//         return res.send(data).status(200);
//     }
    
//     // run a check here if data here exists
//     try{
//         const roomCheck = await rooms.findOne({
//             where:{roomNo, hostel_id, block_id, bedNo}
//         });
        
//         if(roomCheck === null){    
//             try{
//                 const hostel = await hostels.findOne({
//                     where:{uuid:hostel_id}
//                 })
                
//                 gender = hostel.gender;

//                 const room = await rooms.create({roomNo, hostel_id, block_id, bedNo, gender:gender});
//                 data.data = room;
//                 data.success = true;
//                 data.message = "room uploaded";
//                 return res.send(data).status(200);

//             }catch(err){
//                 data.data = {};
//                 data.message = err.errors[0].message;
//                 data.success = false;
//                 return res.send(data).status(400);
//                 }
            
//         }else{ 
//             data.data = {roomNo, hostel_id, block_id, bedNo} ;
//             data.message = "data exists";
//             return res.send(data).status(400);
//         }

//     }catch(err){
//         data.data = {};
//         data.message = err.errors[0].message;
//         data.success = false;
//         return res.send(data).status(400);
//     }

// })


module.exports = routes;
