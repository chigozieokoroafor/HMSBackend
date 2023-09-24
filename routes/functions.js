const Joi =  require("joi");
const jwt = require('jsonwebtoken');

function validateRooms(data){
    const schema = Joi.object({
        hostel_id: Joi.string().required(),
        block_id: Joi.string().required(),
        bedNo: Joi.number().required(),
        matricNo: Joi.string(),
        roomNo: Joi.number().required()

    })
    const result = schema.validate(data);
    return  result;
}

// function validateBlocks(data){
//     const schema = Joi.object({
//         hostel_id: Joi.string().required(),
//         label: Joi.string().required()

//     });

//     const result = schema.validate(data);
//     return result;
// }

function validateHostel(data){
    const schema = Joi.object({
        hostel_id: Joi.string().required(),
        label: Joi.string().required()

    });

    const result = schema.validate(data);
    return result;
}

function create_access_token(data){
    
}



module.exports.validateRooms =  validateRooms;
module.exports.validateHostel = validateHostel; 