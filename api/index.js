const express = require ("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());

const users = [
    {
        id: "1",
        username: "Sufyan",
        password: "sufyan123",
        Admin: true
    },
    {
        id: "2",
        username: "ali",
        password: "ali123",
        Admin: false
    }

]
let Token;

const generatetoken = (user)=>{
    return jwt.sign({id:user.id, Admin:user.Admin},process.env.token_key,
           { expiresIn: "1m"}
           );
   }

   
   const verify = (req,res,next) => {
       const authHeader = req.headers.tt;
       if(authHeader){
           const token  = authHeader;
           jwt.verify(token,process.env.token_key, (err,user)=>{
               if(err){
                   return res.status(403).send("Token is not valid");
               }
               req.user = user;
               next();
           })
       }
       else{
           res.status(401).send("You are not authenticated..")
       }
   }



app.post("/auth/login", (req,res)=>{
    const {username, password} = req.body;
    const user = users.find((u)=>{
        return u.username === username && u.password === password
    })
    if(user){
        const accessToken=generatetoken(user);
        Token=accessToken;
            res.status(200).json({
                username: user.username,
                Admin:user.Admin,
                accessToken
            })
        }
        else{
        res.status(404).send("User not found");
    }
});
app.delete("/user/:userId", verify, (req,res)=>{
    if(req.user.id === req.params.userId || req.user.Admin){
        res.status(200).send("User has been deleted successfully....");
    }
    else{
        res.status(403).send("You are not allowed to delete user..")
    }
});

app.post("/user/logout", verify, (req,res)=>{
    const ttoken = req.body.token;
    Token= Token.filter((tt)=>tt !== ttoken);
    res.status(200).send("You have been logged out...");

})








app.listen(5000, ()=>{
    console.log("Backend is running at port...");
})