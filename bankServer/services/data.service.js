    // import model Account 
    const db = require('./db')

    //import jsonwebtoken
    const jwt =require('jsonwebtoken')
    
    // login function
    const login = (acno,pswd)=>{
        console.log('inside login function definition');

        //check acno and pswd is present in mongo db

        // asynchronous function - promise
        return db.Account.findOne({
            acno,
            password:pswd
        }).then((result)=>{
            if(result){

                //acno n pswd is present in db
                console.log('login successfull');
                
                
                //current acno
                let currentAcno=acno


                //generate Token
                const token = jwt.sign({
                    currentAcno:acno
                },'supersecretkey123')
                
                
                return {
                    status:true,
                    message:'login successfull',
                    username:result.username,
                    statusCode:200,
                    token,
                    currentAcno
                }
            }
            else{
                console.log('Invalid Account / Password');
                return {
                    status:false,
                    message:'Invalid Account / Password',
                    statusCode:404
                }
            }
        }).catch((error)=>{
            console.log(error);
        })
    }

    //register
    const register = (acno,pswd,uname)=>{
        console.log('inside register function definition');
        //check acno and pswd is present in mongo db
        // asynchronous function - promise
        return db.Account.findOne({
            acno
        }).then((result)=>{
            if(result){
                //acno present in db
                console.log('already registerd');
                return {
                    status:false,
                    message:'Account already exist.. Please Log In',
                    statusCode:404
                }
            }
            else{
                console.log('register successfull');
                let newAccount = new db.Account({
                    acno,
                    password:pswd,
                    username:uname,
                    balance:0,
                    transaction:[]  
                })
                newAccount.save()
                return {
                    status:true,
                    message:'register successfull',
                    statusCode:200
                }
            }
        })
    }

    // deposit
        const deposit = (req,acno,pswd,amount)=>{
            console.log('inside deposit function definition');
            //convert string amount to number 
            let amt = Number(amount)
            //check acno and pswd is present in mongo db
            // asynchronous function - promise
            return db.Account.findOne({
                acno,
                password:pswd
            }).then((result)=>{
                if(result){
                    if(req.currentAcno!=acno){
                        return {
                            status:false,
                            message:'Operation denied...Allows only own account transaction.',
                            statusCode:404
                        }
                    }
                    //acno n pswd is present in db
                      result.balance += amt
                    result.transaction.push({
                        type:"CREDIT",
                        amount:amt
                    })
                    result.save()
                    return {
                        status:true,
                        message:`${amount} deposited successfully`,
                        statusCode:200
                    }
                }
                else{
                    console.log('Invalid Account / Password');
                    return {
                        status:false,
                        message:'Invalid Account / Password',
                        statusCode:404
                    }
                }
            }).catch((error)=>{
                console.log(error);
            })

    }






    // exports
    module.exports={
        login,
        register,
        deposit
    }