const https = require('https');
const express = require('express');
const axios =  require('axios');
const {rooms} = require('../models');
// const express = require('express');  
const crypto = require('crypto');
// const secret = process.env.SECRET_KEY;

routes = express.Router();
routes.use(express.json());



routes.post('/makepayment', async (req, res)=>{
  const {jwt_token} = req.headers; //get price from the jwt token
  const {price, matric_number, room_id} = req.query;
  // console.log(price);
  const {email} = req.body;

  const params = JSON.stringify({
    "email": email,
    "amount": (price*100).toString(),
    "metadata":{
      "matric_number":matric_number,
      "room_id":Number(room_id)
    }
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
  
  const request = https.request(options, response => {
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

routes.get("/verify", (req, res)=>{
  const {reference} = req.query;

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transfer/verify/'+reference,
    method: 'GET',
    headers: {
      Authorization: 'Bearer sk_test_5a54271deffe5c7acfa7fe08483ae626f4d79b84'
    }
  }
  
  
  let request_data =  https.request(options, response => {
    let data = ''
  
    response.on('data', (chunk) => {
      data += chunk
    });
  
    response.on('end', async () => {
      const new_data = await JSON.parse(data);
      console.log(new_data);
    })
  }).on('error', error => {
    console.error(error)
  })

})


// routes.get('/new/verify', async(req,res) => {  
 
//   const ref = req.query.reference;
//   let output;
//   await axios.get(`https://api.paystack.co/transaction/verify/${ref}`,    
//     {headers:{
//       authorization: "Bearer TEST SECRET KEY",
//   //replace TEST SECRET KEY with your actual test secret 
//   //key from paystack
//       "content-type": "application/json",
//       "cache-control": "no-cache",
//     }
//   },

//   ).then((success)=>{
//       output=success;
//   }).catch((error)=>{
//   output=error;
//   });

//   //now we check for internet connectivity issues
//   if(!output.response && output.status!==200){
//     // throw new UserInputError("No internet Connection");
//     console.log(output)
//   }
//   //next,we confirm that there was no error in verification.
//     if(output.response && !output.response.data.status){
//       console.log(output)
//     };
    
//   //we return the output of the transaction
//   res.status(200).send("Payment was successfully verified");
//   console.log(output);

// }  
// )

routes.post("/webhook", function(req, res) {
  //validate event
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event
    if (event && event.event === 'transfer.success') {
      return res.status(200).json({ message: 'Transfer successful' })
    }  
  } 
  
  res.send(200);
});

module.exports = routes;