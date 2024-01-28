const express = require('express');
const router = express.Router();
const { User, Accounts } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const userDetailsSchema = zod.object({
    username: zod.string().max(20),
    first_name: zod.string().min(2).max(20),
    last_name: zod.string().min(2).max(20),
    password: zod.string().min(6).max(20),
})

const userLoginSchema = zod.object({
    username: zod.string().max(20),
    password: zod.string().min(6).max(20),
})

router.post("/signup", async (req, res) => {
    console.log("enter")
    const userDetails = req.body;
    const { success } = userDetailsSchema.safeParse(userDetails);
    if(!success){
        res.status(400).json({"message": "Invalid details"});
        return; 
    }

    const existingUser = await User.findOne({username: userDetails.username});
    if(existingUser){
        res.status(400).json({"message": "User already exists"})
        return;
    }

    const user = new User(userDetails);
    user.save()

    const account = new Accounts({
        userId : user._id,
        balance : 1+Math.random()*1000
    })
    account.save()

    const token = jwt.sign({
        username: user.username,
        id: user._id,
    }, JWT_SECRET);

    res.status(200).send({
        "status": "success",
        "status_code": 200,
        "message": "User created successfully",
        "data": {
            "token": token,
        }
    });
});

router.post("/login", async (req, res) => {
    const userDetails = req.body;
    let success = userLoginSchema.safeParse(userDetails);
    if(!success){
        res.status(400).json({"message": "Invalid details"})
        return; 
    }
    
    const user = await User.findOne({username: userDetails.username});
    if(!user){
        console.log("here in logn")
        res.status(400).json({"message": "User does not exist"})
        return;
    }
    
    if(user.password !== userDetails.password){
        res.status(400).json({"message": "Password is incorrect"})
        return;
    }

    const token = jwt.sign({
        username: user.username,
        id: user._id,
    }, JWT_SECRET);

    res.status(200).send({
        "status": "success",
        "status_code": 200,
        "message": "User logged in successfully",
        "data": {
            "token": token,
        }
    });
});

module.exports = router;