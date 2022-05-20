require("dotenv").config()
require("./database").connect()

const auth = require("./middleware/auth")
const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("./model/user")

const app = express()

app.use(express.json())

app.get("/", (req,res) => {
    res.status(200).send("Welcome to Server")
})

app.post("/register", async (req,res) => {
    try{
        const {firstName, lastName, email, password} = req.body;

        if(!(email && password && firstName && lastName)){
            res.status(400).send("All input is required")
        }

        const oldUser = await User.findOne({email})
        if(oldUser){
            return res.status(409).send("User Already exist. Please login");
        }

        encryptedUserPassword = await bcrypt.hash(password, 10)

        let user = await User.create({
            first_name: firstName,
            last_name:lastName,
            email:email.toLowerCase(),
            password: encryptedUserPassword,
        })

        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn:"5h",
            }
        )

        user = {
            _id : user._id,
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            password:user.password,
            __v:user.__v,
            token:token
        }

        res.status(201).json(user)
        console.log(user)
    }catch(err){
        console.log(err)
    }
})


app.post("/login",async (req,res) => {
    try{
        const {email,password } =req.body;

        if(!(email && password)){
            res.status(400).send("All input is required")
        }

        let user = await User.findOne({email});

        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                { user_id : user._id,email},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"5h"
                }
            )
            
            user = {
                _id : user._id,
                first_name:user.first_name,
                last_name:user.last_name,
                email:user.email,
                password:user.password,
                __v:user.__v,
                token:token
            }
            
            return res.status(200).json(user)
        }
        return res.status(400).send("Invalid Credintials")
    }catch(err){
        console.log(err)
    }
})

app.get("/welcome", auth, (req,res) => {
    res.status(200).send("Welcome to My express App")
})

module.exports = app

