//jshint esversion:6
require('dotenv').config();
//make a .env file in root directory and  wo cheeze dalo jo ki tum share nahi karna chahte to github pe like encryption method and api keys;
const express = require("express");
const mongoose= require("mongoose")
const ejs = require('ejs');
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/secretsDb", {useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    email:String,
    password: String,
});
 
 userSchema.plugin(encrypt,{secret: process.env.SECRET ,encryptedFields: ["password"] });
 //it will alsways added before the neeche vali line
 //means const User vali line

const User = new mongoose.model("User",userSchema); //new added

app.get("/", function(req, res)
{
    res.render("home");
});







app.get("/register", function(req, res)
{
    res.render("register");
});
app.get("/login", function(req, res)
{
    res.render("login");
});


app.post("/register", function(req, res){
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password,
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    }
    )
});

app.post("/login",function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if (foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    });
});





app.listen(3000,function(){
    console.log("Server is successfully started at post 3000");
});

//always start with started mongod in hyper