// using express , create server

//1. import express
const express = require('express')

//import data service
const dataService = require('./services/data.service')

//import cors
const cors = require('cors')

//import jsonwebtoken
const jwt =require('jsonwebtoken')
    

//2. create an server app using express
const app = express()

//using cors define origin to server app
app.use(cors({
    origin:['http://localhost:4200']
}))

//to parse json data
app.use(express.json())

//3. set up port server app
app.listen(3000,()=>{
    console.log('Server started at port 3000');
})

//application specific middleware
const appMiddleware =(req,res,next)=>{
    console.log('This is Application Specific Middleware');
    next();
};
app.use(appMiddleware);

//router specific middleware - TOKEN VALIDATION
const jwtMiddleware = (req, res, next) => {
    console.log("Inside router specific middleware");
    //get token from request headers x-access-token key
    let token = req.headers["x-access-token"];

//verify token using jsonwebtoken
 try{
     let data = jwt.verify(token, "supersecretkey123");
     req.currentAcno = data.currentAcno;
next();
} catch {
    res.status(404).json({
        status: false,
        message: "Token Authentication failed...Please Log In...",
    });
}


};


//http request -REST API-BANK API

//1.LOGIN API
app.post('/login',(req,res)=>{
    console.log('inside login function');
    console.log(req.body);
    //asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//2.REGISTER API
app.post('/register',(req,res)=>{
    console.log('inside register function');
    console.log(req.body);
    //asynchronus
    dataService.register(req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})


//3.DEPOSIT API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('inside deposit function');
    console.log(req.body);
    //asynchronus
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
