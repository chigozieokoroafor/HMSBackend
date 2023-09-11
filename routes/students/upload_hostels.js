const { sequelize, rooms, hostels, blocks} =  require('../../models');
const express = require("express");
const router = express.Router();

// authentication first
router.use(express.json())

router.get("/get", async(req, res)=>{
    var hostel = await hostels.findAll()
    res.send(hostel).status(200)

});
router.post('/uploadHostel', async(req, res) =>{
    const {name, gender} =  req.body;

});

module.exports =  router;