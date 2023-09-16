const https = require('https');
const express = require('express');
const axios =  require('axios');

routes = express.Router();
routes.use(express.json());



routes.post('/makepayment', async (req, res)=>{
  const {jwt_token} = req.headers; //get price from the jwt token
  const {price} = req.query;
  // console.log(price);
  const {email} = req.body;
  const params = JSON.stringify({
    "email": email,
    "amount": (price*100).toString()
  })
  // console.log(params);
  
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: 'Bearer sk_test_5a54271deffe5c7acfa7fe08483ae626f4d79b84',
      'Content-Type': 'application/json'
    }
  }
  
  let res_data = {
    message:"",
    data:{},
    success:true
  }
  
  const request = await https.request(options, response => {
    let data = ''
  
    response.on('data', (chunk) => {
      data += chunk
    });
  
    response.on('end', async () => {
      response_data =  await JSON.parse(data);
      
      switch (response_data.status){
        case true:
          res_data.data.url = response_data.data.authorization_url
          res_data.success = true;
          return res.send(res_data).status(200);
          
        case false:
          res_data.message = response_data.message
          res_data.success = false;
          return res.send(res_data).status(200);
        }
    })
  }).on('error', error => {
    return res.send(error).status(400);
  })
  
  request.write(params)
  request.end()
  
})

module.exports = routes;