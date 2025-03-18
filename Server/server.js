const express = require('express');
const cors = require('cors');
require('dotenv/config')
const connectDb = require('./database/db.js');
const clerkWebhooks = require('./controlleres/webhooks')

//initialize express
const app = express();

//middleware 
app.use(express.json());

//connecting to db
connectDb();

// routes
app.get('/',(req,res)=>{
    res.send("API Workings");
});
app.post('/clerk' , express.json() , clerkWebhooks);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})