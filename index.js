const {sequelize} =  require("./models")
const express =  require("express");
const student_routes = require("./routes/students/student_routes");
const hostel_routes = require("./routes/students/upload_hostels");


const app = express();
app.use(express.json());
app.use("/students", student_routes);
app.use('/hostel', hostel_routes);



app.listen(3000, async ()=>{
    console.log("started");
    // await sequelize.sync({force:true}); // it deletes previous table and creates new one
    // await sequelize.sync({alter:true}); //this just alters the table
    // await sequelize.sync({force:true});
    await sequelize.authenticate();
    console.log("connected to database")
    


})

