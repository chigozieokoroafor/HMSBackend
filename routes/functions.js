const Joi =  require("joi");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.secret_key;

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

function validateToken(req, res, next){
    const token = req.get('Authorization');
    if (token == null) return res.send({"message":"Token Required", "success":false}).status(401)

    jwt.verify(token, secret_key, (err, user)=>{
            if (err){
                if (err.name ==="TokenExpiredError"){
                    return res.send({
                        "message":"Token Expired",
                        "success":false
                    }).status(400)
                }
                if (err.name === "JsonWebTokenError"){
                    return res.send({
                        "message":"Invalid Token",
                        "success":false
                    }).status(400)
                }

                return res.send(err);
            }else{
                req.user = user

            }
        });
    next();
    
    // add the JWT erification to all routes except login. continue from here tomorrow morning.  

}



module.exports.validateRooms =  validateRooms;
module.exports.validateHostel = validateHostel; 
module.exports.secret_key = secret_key;
module.exports.validate_token = validateToken;